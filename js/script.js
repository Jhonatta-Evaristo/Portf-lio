// 1. ANIMAÇÃO DO FUNDO TECNOLÓGICO (Partículas)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#00ff88'; // Verde neon
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebater nas bordas
        if (this.size + this.x > canvas.width || this.x - this.size < 0) this.speedX = -this.speedX;
        if (this.size + this.y > canvas.height || this.y - this.size < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Conectar as partículas com linhas (Efeito Rede/Constelação)
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 - distance / 600})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Redimensionar o canvas se a janela mudar de tamanho
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    updateCarousel(); // Atualiza também o carrossel no resize
});


// 2. EFEITO SCROLL (Aparecer suavemente)
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Anima apenas 1 vez
        }
    });
};

const revealOptions = {
    threshold: 0.15, // 15% do elemento visível
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Ativar logo de cara a seção Hero
setTimeout(() => {
    document.querySelector('.hero').classList.add('active');
}, 100);


// 3. LÓGICA DO CARROSSEL DE PROJETOS
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function updateCarousel() {

    const card = track.children[0];
    const gap = 30;
    const moveAmount = card.offsetWidth + gap;

    track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

    const viewportWidth = track.parentElement.offsetWidth;
    const totalCards = track.children.length;

    const visibleCards = Math.floor(viewportWidth / card.offsetWidth);
    const maxIndex = totalCards - visibleCards;

    // esconder seta esquerda
    if (currentIndex <= 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "flex";
    }

    // esconder seta direita
    if (currentIndex >= maxIndex || maxIndex <= 0) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "flex";
    }
}

nextBtn.addEventListener('click', () => {
    // Calcular quantos cards cabem na tela atualmente
    const viewportWidth = track.parentElement.offsetWidth;
    const cardWidth = track.children[0].offsetWidth;
    const visibleCards = Math.floor(viewportWidth / cardWidth);
    const totalCards = track.children.length;

    // Impede rolar para o vazio
    if (currentIndex < totalCards - visibleCards) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});


// 4. API DO WHATSAPP (Formulário de Contato)
document.getElementById('whatsappForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede recarregar a página

    const nome = document.getElementById('nome').value;
    const ideia = document.getElementById('ideia').value;

    // Número do WhatsApp
    const numeroWhatsApp = "5598987326274";

    // Montar a mensagem estruturada
    const mensagem = `Olá, meu nome é *${nome}*!%0A%0A*Tenho uma ideia de projeto:*%0A${ideia}%0A%0AGostaria de tirar essa ideia do papel!`;

    // Criar a URL
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;

    // Abrir em uma nova aba
    window.open(url, '_blank');
});
window.addEventListener('load', updateCarousel);

