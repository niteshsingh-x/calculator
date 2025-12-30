const prevEl = document.getElementById('prev');
const currEl = document.getElementById('curr');
const buttons = document.querySelectorAll('button');

let currentOperand = '0';
let previousOperand = '';
let operation = null;

function updateDisplay() {
    currEl.textContent = currentOperand;
    let opSymbol = '';
    if (operation === 'add') opSymbol = '+';
    if (operation === 'subtract') opSymbol = '−';
    if (operation === 'multiply') opSymbol = '×';
    if (operation === 'divide') opSymbol = '÷';

    prevEl.textContent = previousOperand
        ? `${previousOperand} ${opSymbol}`
        : '';
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function deleteDigit() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(num) {
    if (num === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && num !== '.') {
        currentOperand = num;
    } else {
        currentOperand += num;
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '0';
    updateDisplay();
}

function compute() {
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operation) {
        case 'add':
            result = prev + curr;
            break;
        case 'subtract':
            result = prev - curr;
            break;
        case 'multiply':
            result = prev * curr;
            break;
        case 'divide':
            if (curr === 0) {
                currentOperand = 'Cannot divide by 0';
                previousOperand = '';
                operation = null;
                updateDisplay();
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }

    currentOperand = String(+result.toFixed(8)).replace(/\.0+$/, '');
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function toggleSign() {
    if (currentOperand === '0' || currentOperand === 'Cannot divide by 0') return;
    currentOperand = currentOperand.startsWith('-')
        ? currentOperand.slice(1)
        : '-' + currentOperand;
    updateDisplay();
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const op = btn.dataset.operation;
        const text = btn.textContent;

        if (btn.classList.contains('btn-number')) {
            appendNumber(text);
            return;
        }

        if (op) {
            chooseOperation(op);
            return;
        }

        if (action === 'clear') {
            clearAll();
        } else if (action === 'delete') {
            deleteDigit();
        } else if (action === 'equals') {
            compute();
        } else if (action === 'sign') {
            toggleSign();
        }
    });
});

// Initialize
updateDisplay();
