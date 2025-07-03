// --- HELPER FUNCTIONS FOR CALCULATIONS ---

// Function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i = i + 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Function to find primes with N digits (Logic for Question 2)
function findPrimesWithNDigits(n) {
    if (n < 2 || n > 10) {
        return "<p style='color:red;'>Số chữ số N phải từ 2 đến 10.</p>";
    }

    const primes = [];
    const startNum = Math.pow(10, n - 1);
    const endNum = Math.pow(10, n) - 1;

    // Loop through all numbers with N digits and check for primality
    // For very large N (like 10), this might take a while in the browser.
    // Consider adding a progress indicator or limiting the range if performance is an issue.
    for (let i = startNum; i <= endNum; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    
    if (primes.length === 0) {
        return "<p>Không tìm thấy số nguyên tố nào có " + n + " chữ số.</p>";
    }

    // Format output nicely, limiting the number of displayed primes if the list is too long
    const maxPrimesToShow = 100; // Adjust as needed
    const displayedPrimes = primes.slice(0, maxPrimesToShow);
    const moreThanDisplayed = primes.length > maxPrimesToShow ? ` (và ${primes.length - maxPrimesToShow} số khác)` : '';

    return `<p>Các số nguyên tố có ${n} chữ số là: <strong>${displayedPrimes.join(', ')}</strong>${moreThanDisplayed}.</p>`;
}

// Function for Question 1: Find Q-Primes
// A Q-prime is a number with exactly 4 positive divisors.
function findQPrimes(n) {
    if (n <= 0 || !Number.isInteger(n)) {
        return "<p style='color:red;'>Vui lòng nhập một số nguyên dương cho N.</p>";
    }

    const qPrimes = [];
    // Loop from 1 up to N
    for (let i = 1; i <= n; i++) {
        let divisors_count = 0;
        // Count divisors for the number 'i'
        // Optimization: loop up to sqrt(i)
        for (let j = 1; j * j <= i; j++) {
            if (i % j === 0) {
                divisors_count++; // j is a divisor
                if (j * j !== i) { // If j*j is not equal to i, then i/j is another distinct divisor
                    divisors_count++;
                }
            }
        }
        // A number is Q-prime if it has exactly 4 divisors
        if (divisors_count === 4) {
            qPrimes.push(i);
        }
    }

    if (qPrimes.length > 0) {
        const maxQPrimesToShow = 50; // Limit displayed results for readability
        const displayedQPrimes = qPrimes.slice(0, maxQPrimesToShow);
        const moreThanDisplayed = qPrimes.length > maxQPrimesToShow ? ` (và ${qPrimes.length - maxQPrimesToShow} số khác)` : '';
        
        return `<p>Các số Q-Prime nhỏ hơn hoặc bằng ${n} là: <strong>${displayedQPrimes.join(', ')}</strong>${moreThanDisplayed}.</p>`;
    } else {
        return `<p>Không tìm thấy số Q-Prime nào nhỏ hơn hoặc bằng ${n}.</p>`;
    }
}

// --- Add functions for other questions here ---
// Example:
// function findQuestion3Logic(n, p, s, q, k) { ... }


// --- CORE APPLICATION LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    const questionsSelect = document.getElementById('questions');
    const questionContentArea = document.getElementById('question-content-area');
    const errorMessageContainer = document.getElementById('error-message-container');

    // Displays an error message in the designated area
    function displayError(message) {
        errorMessageContainer.style.display = 'block';
        errorMessageContainer.innerHTML = `<p>${message}</p>`;
    }

    // Renders the UI for the selected question (title, description, form, result)
    function renderQuestion(questionData) {
        let html = `
            <div class="question-details">
                <h3>${questionData.title}</h3>
                <p>${questionData.description}</p>
            </div>
        `;

        // Render the form if formConfig is provided in the JSON
        if (questionData.formConfig) {
            const formConfig = questionData.formConfig;
            const formId = `cau-form-${formConfig.questionId}`;
            const inputId = `input_field_cau${formConfig.questionId}`;

            html += `
                <form id="${formId}">
                    <div class="form-wrapper">
                        <label for="${inputId}">${formConfig.inputLabel}</label><br>
                        <input
                            type="${formConfig.inputType}"
                            id="${inputId}"
                            name="${formConfig.inputName}"
                            value="${formConfig.inputValueDefault || ''}"
                            ${formConfig.inputAttributes}
                        >
                        <input type="hidden" name="selected_question_name" value="${formConfig.questionId}">
                        <input type="submit" name="${formConfig.submitActionName}" value="${formConfig.submitButtonText}">
                    </div>
                </form>
            `;
            
            // Attach event listener for the dynamically created form submission
            // Using setTimeout to ensure the form element exists in the DOM before attaching the listener
            setTimeout(() => {
                const formElement = document.getElementById(formId);
                if (formElement) {
                    formElement.addEventListener('submit', (e) => {
                        e.preventDefault(); // Prevent default browser form submission
                        
                        const inputElement = document.getElementById(inputId);
                        // Parse input value, defaulting to NaN if not a valid number
                        const inputValue = parseInt(inputElement.value); 

                        let resultHtml = "";
                        const calculationFuncName = formConfig.calculationFunctionName; // Get function name from JSON

                        // Check if the specified calculation function exists globally
                        if (calculationFuncName && typeof window[calculationFuncName] === 'function') {
                            // Call the appropriate JavaScript function for calculation
                            resultHtml = window[calculationFuncName](inputValue);
                        } else {
                            resultHtml = "<p>Logic tính toán chưa được triển khai hoặc sai tên hàm.</p>";
                        }
                        
                        // Display the calculated result
                        displayResult(resultHtml);
                    });
                }
            }, 0);
        }

        // Set the HTML content for the question and make the area visible
        questionContentArea.innerHTML = html;
        questionContentArea.style.display = 'block';
    }

    // Displays the result of a calculation
    function displayResult(resultHtml) {
        // Remove any previous result to avoid stacking
        const existingResultDiv = questionContentArea.querySelector('.result-output');
        if (existingResultDiv) {
            existingResultDiv.remove();
        }

        // Create a new div for the result
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-output';
        resultDiv.innerHTML = resultHtml;
        questionContentArea.appendChild(resultDiv); // Append to the main content area
    }

    // Loads the details (title, description, form config) for a specific question from a JSON file
    function loadQuestionDetails(questionName) {
        fetch(`data/cau${questionName}_details.json`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) throw new Error("Tệp dữ liệu câu hỏi không tồn tại.");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderQuestion(data);
            })
            .catch(error => {
                console.error(`Error loading details for question ${questionName}:`, error);
                displayError(`Không thể tải chi tiết cho câu hỏi ${questionName}: ${error.message}`);
                questionContentArea.style.display = 'none'; // Hide content area if error occurs
            });
    }

    // --- INITIALIZATION ---

    // Fetch the list of questions from questions.json to populate the dropdown
    fetch('data/questions.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(questions => {
            if (!Array.isArray(questions) || questions.length === 0) {
                displayError("Không có câu hỏi nào trong dữ liệu.");
                return;
            }
            questions.forEach(q => {
                const option = document.createElement('option');
                option.value = q.name;
                option.textContent = q.displayName;
                questionsSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            displayError(`Không thể tải danh sách câu hỏi: ${error.message}`);
        });

    // Event listener for the dropdown to handle question selection
    questionsSelect.addEventListener('change', (event) => {
        const selectedQuestionName = event.target.value;

        if (!selectedQuestionName) {
            questionContentArea.style.display = 'none'; // Hide content area if no question is selected
            return;
        }

        loadQuestionDetails(selectedQuestionName);
    });

    // Initialize: Hide the content area until a question is selected
    questionContentArea.style.display = 'none';
});
