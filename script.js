// script.js (fixed)

// Grab display elements
const previousEl = document.getElementById('previous');
const currentEl = document.getElementById('current');

// State variables
let current = '';
let previous = '';
let operator = null;
let overwrite = false;

// --- Functions ---
function appendNumber(num) {
  if (overwrite) {
    current = '';
    overwrite = false;
  }
  if (num === '.' && current.includes('.')) return;
  if (num === '0' && current === '0') return;
  current = current === '0' && num !== '.' ? num : current + num;
  updateDisplay();
}

function chooseOperator(op) {
  if (!current && !previous) return;
  if (!current) {
    operator = op;
    previous = previous.slice(0, -1) + op;
    updateDisplay();
    return;
  }
  if (!previous) {
    previous = current + op;
    operator = op;
    current = '';
    updateDisplay();
    return;
  }
  const result = compute();
  previous = result + op;
  operator = op;
  current = '';
  updateDisplay();
}

function compute() {
  const prevNum = parseFloat(previous.slice(0, -1));
  const currentNum = parseFloat(current);
  if (isNaN(prevNum) || isNaN(currentNum)) return '';
  let result;
  switch (operator) {
    case '+':
      result = prevNum + currentNum;
      break;
    case '-':
      result = prevNum - currentNum;
      break;
    case '×':
      result = prevNum * currentNum;
      break;
    case '÷':
      result = currentNum === 0 ? 'Error' : prevNum / currentNum;
      break;
    default:
      return '';
  }
  return (Math.round((result + Number.EPSILON) * 1e12) / 1e12).toString();
}

function clearAll() {
  current = '';
  previous = '';
  operator = null;
  overwrite = false;
  updateDisplay();
}

function deleteLast() {
  if (overwrite) {
    current = '';
    overwrite = false;
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay();
}

function evaluate() {
  if (!previous || !current) return;
  const result = compute();
  previous = '';
  current = result;
  operator = null;
  overwrite = true;
  updateDisplay();
}

function updateDisplay() {
  currentEl.textContent = current || '0';
  previousEl.textContent = previous || '';
}

// --- Event listeners ---
// NOTE: use btn.hasAttribute('data-number') and use button textContent for the digit
document.querySelectorAll('button').forEach((btn) => {
  const action = btn.getAttribute('data-action');

  btn.addEventListener('click', () => {
    if (btn.hasAttribute('data-number')) {
      // Read the visual label of the button (e.g. "7") instead of relying on empty attribute value
      return appendNumber(btn.textContent.trim());
    }
    if (action === 'operator') return chooseOperator(btn.textContent.trim());
    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteLast();
    if (action === 'equals') return evaluate();
  });
});

// --- Keyboard support ---
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Enter' || e.key === '=') {
    evaluate();
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    const map = { '/': '÷', '*': '×' };
    chooseOperator(map[e.key] || e.key);
  }
});

