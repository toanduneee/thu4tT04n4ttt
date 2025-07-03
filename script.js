// --- HELPER FUNCTIONS FOR CALCULATIONS ---

// Helper function to check if a number is prime
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

    for (let i = startNum; i <= endNum; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    
    if (primes.length === 0) {
        return "<p>Không tìm thấy số nguyên tố nào có " + n + " chữ số.</p>";
    }

    const maxPrimesToShow = 100; 
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
        if (divisors_count === 4) {
            qPrimes.push(i);
        }
    }

    if (qPrimes.length > 0) {
        const displayedQPrimes = qPrimes; 
        const moreThanDisplayed = '';
        
        return `<p>Các số Q-Prime nhỏ hơn hoặc bằng ${n} là: <strong>${displayedQPrimes.join(', ')}</strong>${moreThanDisplayed}.</p>`;
    } else {
        return `<p>Không tìm thấy số Q-Prime nào nhỏ hơn hoặc bằng ${n}.</p>`;
    }
}

// --- Add functions for other questions here ---
// Example for Question 4: Count primes in range [A, B]
function countPrimesInRange(a, b) {
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0 || a > b) {
        return "<p style='color:red;'>Vui lòng nhập hai số nguyên dương A và B hợp lệ, với A ≤ B.</p>";
    }

    let count = 0;
    // Iterate from A to B (inclusive)
    for (let i = a; i <= b; i++) {
        if (isPrime(i)) {
            count++;
        }
    }
    
    return `<p>Số lượng số nguyên tố trong khoảng [${a}, ${b}] là: <strong>${count}</strong>.</p>`;
}

// Example for Question 5: Sum of primes in range [A, B]
function sumPrimesInRange(a, b) {
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0 || a > b) {
        return "<p style='color:red;'>Vui lòng nhập hai số nguyên dương A và B hợp lệ, với A ≤ B.</p>";
    }

    let sum = 0;
    // Iterate from A to B (inclusive)
    for (let i = a; i <= b; i++) {
        if (isPrime(i)) {
            sum += i;
        }
    }
    
    return `<p>Tổng các số nguyên tố trong khoảng [${a}, ${b}] là: <strong>${sum}</strong>.</p>`;
}


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

    // Renders the UI for the selected question (title, description, form, result area)
    function renderQuestion(questionData) {
        let html = `
            <div class="question-details">
                <h3>${questionData.title}</h3>
                <p>${questionData.description}</p>
            </div>
        `;
    
        // Render the form if formConfig is provided
        if (questionData.formConfig) {
            const formConfig = questionData.formConfig;
            const formId = `cau-form-${formConfig.questionId}`;
            
            html += `<form id="${formId}">`;
            html += `<div class="form-wrapper">`;
    
            // Render multiple input fields if available in formConfig.inputs
            if (formConfig.inputs && Array.isArray(formConfig.inputs)) {
                formConfig.inputs.forEach(inputInfo => {
                    // Generate a unique ID for each input field
                    const inputId = `input_field_${inputInfo.name}`; 
                    html += `
                        <label for="${inputId}">${inputInfo.label}</label><br>
                        <input
                            type="${inputInfo.type}"
                            id="${inputId}"
                            name="${inputInfo.name}"
                            value="${inputInfo.defaultValue || ''}"
                            ${inputInfo.attributes || ''}
                        >
                    `;
                });
            }
            // Note: The fallback for single input is less critical now with the inputs array
            
            // Hidden field for question identifier
            html += `<input type="hidden" name="selected_question_name" value="${formConfig.questionId}">`;
            
            // Submit button
            html += `<input type="submit" name="${formConfig.submitActionName || `submit_cau_${formConfig.questionId}`}" value="${formConfig.submitButtonText || 'Gửi'}">`;
            
            html += `</div></form>`; // Close form-wrapper and form
    
            // Add event listener for form submission.
            // Using setTimeout ensures the form is rendered and elements are available before attaching listeners.
            setTimeout(() => {
                const formElement = document.getElementById(formId);
                if (formElement) {
                    formElement.addEventListener('submit', (e) => {
                        e.preventDefault(); // Prevent default form submission
                        
                        let resultHtml = "";
                        const calculationFuncName = formConfig.calculationFunctionName;
                        let calculationArgs = []; // Array to hold arguments for the calculation function
                        let allInputsValid = true; // Flag to check if all input values are valid
    
                        // --- Get input values and prepare arguments ---
                        if (formConfig.inputs && Array.isArray(formConfig.inputs)) {
                            formConfig.inputs.forEach(inputInfo => {
                                const inputElement = document.getElementById(`input_field_${inputInfo.name}`);
                                let value = inputElement ? inputElement.value : '';
                                
                                // Process value based on input type
                                if (inputInfo.type === 'number') {
                                    let numValue = parseInt(value);
                                    // Basic validation for numbers (check if it's NaN)
                                    if (isNaN(numValue)) {
                                        // If validation fails, use null and mark allInputsValid as false
                                        value = null; 
                                        allInputsValid = false;
                                    } else {
                                        value = numValue; // Use the parsed integer value
                                    }
                                }
                                calculationArgs.push(value);
                            });
                        } else {
                            // Handle cases where there might not be an inputs array (though discouraged)
                            const inputElement = document.getElementById(`input_field_cau${formConfig.questionId}`);
                            let value = inputElement ? inputElement.value : '';
                            if (formConfig.inputType === 'number') {
                                let numValue = parseInt(value);
                                if (isNaN(numValue)) {
                                    value = null;
                                    allInputsValid = false;
                                } else {
                                    value = numValue;
                                }
                            }
                            calculationArgs.push(value);
                        }
    
                        // --- Call the calculation function dynamically ---
                        if (calculationFuncName && typeof window[calculationFuncName] === 'function') {
                            // Check if all inputs were valid before proceeding
                            if (allInputsValid) {
                                // Use the spread syntax (...) to pass the array of arguments
                                // to the appropriate JavaScript function.
                                resultHtml = window[calculationFuncName](...calculationArgs);
                            } else {
                                resultHtml = "<p style='color:red;'>Vui lòng nhập giá trị hợp lệ cho tất cả các trường.</p>";
                            }
                        } else {
                            resultHtml = "<p>Logic tính toán chưa được triển khai hoặc sai tên hàm.</p>";
                        }
                        
                        displayResult(resultHtml);
                    });
                }
            }, 0);
        }

        questionContentArea.innerHTML = html;
        questionContentArea.style.display = 'block';
    }

    // Displays the result of a calculation in the designated area
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
        // Construct the path to the JSON file for the specific question
        fetch(`data/cau${questionName}_details.json`)
            .then(response => {
                // Handle HTTP errors (e.g., file not found)
                if (!response.ok) {
                    if (response.status === 404) throw new Error("Tệp dữ liệu câu hỏi không tồn tại.");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Parse the JSON response
                return response.json();
            })
            .then(data => {
                // Render the question's UI using the loaded data
                renderQuestion(data);
            })
            .catch(error => {
                // Log and display any errors during the fetch or parsing process
                console.error(`Error loading details for question ${questionName}:`, error);
                displayError(`Không thể tải chi tiết cho câu hỏi ${questionName}: ${error.message}`);
                questionContentArea.style.display = 'none'; // Hide content area if an error occurs
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
            // Ensure the fetched data is a non-empty array
            if (!Array.isArray(questions) || questions.length === 0) {
                displayError("Không có câu hỏi nào trong dữ liệu.");
                return;
            }
            // Populate the questions dropdown
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

        // If no question is selected (e.g., the default "-- Chọn một câu hỏi --"), hide the content area
        if (!selectedQuestionName) {
            questionContentArea.style.display = 'none';
            return;
        }

        // Load and render the details for the selected question
        loadQuestionDetails(selectedQuestionName);
    });

    // Initialize: Hide the content area until a question is selected from the dropdown
    questionContentArea.style.display = 'none';
});
