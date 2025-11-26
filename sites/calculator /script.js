function appendToDisplay(value) {
    const display = document.getElementById('result');
    display.value += value;
}

function clearDisplay() {
    document.getElementById('result').value = '';
}

function deleteLast() {
    const display = document.getElementById('result');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const display = document.getElementById('result');
    try {
        const expression = display.value.replace(/×/g, '*');
        const result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        display.value = result;
    } catch (error) {
        display.value = 'Ошибка';
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9+\-*/.=]/.test(key)) {
        event.preventDefault();
        if (key === '=' || key === 'Enter') {
            calculate();
        } else {
            appendToDisplay(key);
        }
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});
