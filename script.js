let displayElement = document.getElementById("display");
let equationElement = document.getElementById("equation-display");
let openBrackets = 0; 
let calculationHistory = []; 

function appendNumber(number) {
    if (displayElement.innerText === "0" && number !== ".") {
        displayElement.innerText = number; 
    } else {
        displayElement.innerText += number; 
    }
}

function appendOperator(operator) {
    let currentText = displayElement.innerText;
    let trimmedText = currentText.trim();
    let lastChar = trimmedText.slice(-1);
    
    // Agar last character already ek operator hai, toh use naye wale se replace kar do
    if (['+', '-', '×', '÷'].includes(lastChar)) {
        displayElement.innerText = trimmedText.slice(0, -1) + " " + operator + " ";
    } else {
        // Warna naya operator add kar do
        displayElement.innerText += " " + operator + " ";
    }
}

function appendDecimal() {
    let currentText = displayElement.innerText;
    let lastNumber = currentText.split(/[\+\-\×\÷\ ]+/).pop();
    if (!lastNumber.includes('.')) {
        displayElement.innerText += '.';
    }
}

function handleBrackets() {
    let currentText = displayElement.innerText;
    if (currentText === "0") {
        displayElement.innerText = "(";
        openBrackets++;
    } else if (openBrackets > 0 && !/[+\-×÷( ]$/.test(currentText)) {
        displayElement.innerText += ")";
        openBrackets--;
    } else {
        displayElement.innerText += "(";
        openBrackets++;
    }
}

function deleteLast() {
    let currentText = displayElement.innerText;
    if (currentText.length > 1) {
        displayElement.innerText = currentText.slice(0, -1);
    } else {
        displayElement.innerText = "0";
    }
}

function clearDisplay() {
    displayElement.innerText = "0";
    equationElement.innerText = "";
    openBrackets = 0;
}

function toggleMenu() {
    let menu = document.getElementById("side-menu");
    menu.classList.toggle("hidden");
}

function toggleHistory() {
    let historyPanel = document.getElementById("history-panel");
    historyPanel.classList.toggle("hidden");
    updateHistoryUI(); 
}

function updateHistoryUI() {
    let historyContainer = document.getElementById("history-list");
    historyContainer.innerHTML = ""; 

    if (calculationHistory.length === 0) {
        historyContainer.innerHTML = "<p class='text-gray-400 text-center font-medium mt-10'>No history yet</p>";
        return;
    }

    for (let i = calculationHistory.length - 1; i >= 0; i--) {
        let item = calculationHistory[i];
        historyContainer.innerHTML += `
            <div class="mb-4 text-right p-3 bg-surface-container-low rounded-xl">
                <div class="text-sm text-[#586065] font-medium">${item.equation}</div>
                <div class="text-2xl font-black text-[#15696d]">${item.result}</div>
            </div>
        `;
    }
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryUI();
}

function calculate() {
    try {
        let mathEquation = displayElement.innerText;
        let originalEquation = mathEquation; 
        
        equationElement.innerText = mathEquation + " =";
        
        mathEquation = mathEquation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        mathEquation = mathEquation.replace(/(\d+(?:\.\d+)?)\s*([\+\-])\s*(\d+(?:\.\d+)?)%/g, function(match, num1, operator, num2) {
            return num1 + operator + '(' + num1 + '*' + num2 + '/100)';
        });
        mathEquation = mathEquation.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
        
        mathEquation = mathEquation.replace(/(\d)(\()/g, '$1*$2'); 
        mathEquation = mathEquation.replace(/(\))(\d)/g, '$1*$2'); 
        mathEquation = mathEquation.replace(/(\))(\()/g, '$1*$2'); 
        
        let answer = eval(mathEquation);
        
        if(answer % 1 !== 0) {
            answer = parseFloat(answer.toFixed(4)); 
        }
        
        displayElement.innerText = answer;
        openBrackets = 0; 

        calculationHistory.push({
            equation: originalEquation + " =",
            result: answer
        });

    } catch (error) {
        displayElement.innerText = "Error";
    }
}
