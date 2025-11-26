console.log('Добро пожаловать в коллекцию мини-сайтов!');

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.site-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});
