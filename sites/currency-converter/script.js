const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    RUB: 90.0,
    CNY: 6.45
};

let lastUpdate = null;

function initConverter() {
    loadRates();
    updateLastUpdateTime();
    convertCurrency();
    updatePopularConversions();
    
    document.getElementById('amount').addEventListener('input', convertCurrency);
    document.getElementById('fromCurrency').addEventListener('change', convertCurrency);
    document.getElementById('toCurrency').addEventListener('change', convertCurrency);
    
    document.querySelectorAll('.conversion-card').forEach(card => {
        card.addEventListener('click', function() {
            const from = this.getAttribute('data-from');
            const to = this.getAttribute('data-to');
            setCurrencies(from, to);
        });
    });
}

function loadRates() {
    const savedRates = localStorage.getItem('currencyRates');
    const savedTime = localStorage.getItem('ratesLastUpdate');
    
    if (savedRates && savedTime) {
        const rates = JSON.parse(savedRates);
        const updateTime = new Date(savedTime);
        const now = new Date();
        const hoursDiff = (now - updateTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            Object.assign(exchangeRates, rates);
            lastUpdate = updateTime;
            return;
        }
    }
    
    fetchRates();
}

async function fetchRates() {
    try {
        showLoading(true);
        
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки курсов');
        }
        
        const data = await response.json();
        
        exchangeRates.USD = 1;
        exchangeRates.EUR = data.rates.EUR || 0.85;
        exchangeRates.GBP = data.rates.GBP || 0.73;
        exchangeRates.JPY = data.rates.JPY || 110.0;
        exchangeRates.RUB = data.rates.RUB || 90.0;
        exchangeRates.CNY = data.rates.CNY || 6.45;
        
        lastUpdate = new Date();
        
        localStorage.setItem('currencyRates', JSON.stringify(exchangeRates));
        localStorage.setItem('ratesLastUpdate', lastUpdate.toISOString());
        
        convertCurrency();
        updatePopularConversions();
        
    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось загрузить актуальные курсы. Используются сохраненные данные.');
    } finally {
        showLoading(false);
    }
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (amount < 0) {
        document.getElementById('amount').value = 0;
        return;
    }
    
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    if (!fromRate || !toRate) {
        showError('Ошибка: неизвестная валюта');
        return;
    }
    
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    
    document.getElementById('convertedAmount').textContent = convertedAmount.toFixed(2);
    document.getElementById('targetCurrency').textContent = toCurrency;
    
    const exchangeRate = toRate / fromRate;
    document.getElementById('exchangeRate').textContent = 
        `1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`;
}

function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    fromSelect.value = toValue;
    toSelect.value = fromValue;
    
    convertCurrency();
}

function setCurrencies(from, to) {
    document.getElementById('fromCurrency').value = from;
    document.getElementById('toCurrency').value = to;
    convertCurrency();
}

function updatePopularConversions() {
    document.querySelectorAll('.conversion-card').forEach(card => {
        const from = card.getAttribute('data-from');
        const to = card.getAttribute('data-to');
        
        const fromRate = exchangeRates[from];
        const toRate = exchangeRates[to];
        
        if (fromRate && toRate) {
            const rate = toRate / fromRate;
            card.querySelector('.conversion-rate').textContent = rate.toFixed(4);
        }
    });
}

function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdate');
    
    if (lastUpdate) {
        element.textContent = lastUpdate.toLocaleString('ru-RU');
    } else {
        element.textContent = 'только что';
        lastUpdate = new Date();
    }
}

function showLoading(loading) {
    const converter = document.querySelector('.converter');
    if (loading) {
        converter.classList.add('loading');
    } else {
        converter.classList.remove('loading');
    }
}

function showError(message) {
    const existingError = document.querySelector('.error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const converter = document.querySelector('.converter');
    converter.insertBefore(errorDiv, converter.querySelector('.convert-btn'));
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initConverter);

setInterval(() => {
    const now = new Date();
    const lastUpdateTime = new Date(localStorage.getItem('ratesLastUpdate'));
    const hoursDiff = (now - lastUpdateTime) / (1000 * 60 * 60);
    
    if (hoursDiff >= 24) {
        fetchRates();
    }
}, 60000);
