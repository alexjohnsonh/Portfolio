const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('.topnav').offsetHeight;

const bubbles = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseInNavbar = false;

// Create the bubbles
for (let i = 0; i < 60; i++) {
    bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + document.querySelector('.topnav').offsetHeight,
        radius: Math.random() * 60 + 20,
        speed: Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2,
        originalRadius: null,
        isInteracting: false,
        color: 'black'
    });
}

// Generate a random rainbow color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Update the bubbles' positions and check for cursor interaction
function update() {
    for (let bubble of bubbles) {
        const dx = bubble.x - mouseX;
        const dy = bubble.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.radius + 40 && !isMouseInNavbar) {
            if (!bubble.isInteracting) {
                bubble.originalRadius = bubble.radius;
                bubble.isInteracting = true;
                bubble.color = getRandomColor();
            }
            bubble.radius = Math.min(bubble.originalRadius + 30, bubble.originalRadius * 2);
        } else {
            if (bubble.isInteracting) {
                bubble.radius = bubble.originalRadius;
                bubble.isInteracting = false;
                bubble.color = 'black';
            }
        }

        bubble.x += Math.cos(bubble.angle) * bubble.speed;
        bubble.y += Math.sin(bubble.angle) * bubble.speed;

        // Bounce off the edges of the canvas and the navigation menu
        if (bubble.x - bubble.radius <= 0 || bubble.x + bubble.radius >= canvas.width) {
            bubble.angle = Math.PI - bubble.angle;
        }
        if (bubble.y - bubble.radius <= document.querySelector('.topnav').offsetHeight || bubble.y + bubble.radius >= canvas.height) {
            bubble.angle = -bubble.angle;
        }
    }
}

// Draw the bubbles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let bubble of bubbles) {
        ctx.fillStyle = bubble.color;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
    draw();
}

// Start the animation
animate();

// Update mouse position on mousemove event
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    isMouseInNavbar = mouseY < document.querySelector('.topnav').offsetHeight;
});

// Reset mouse position when mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
    isMouseInNavbar = false;
});

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.topnav').offsetHeight;
});