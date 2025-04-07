// Cosmic Animation
class Star {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.brightness = Math.random() * 0.5 + 0.5;
        this.color = `rgba(255, 255, 255, ${this.brightness})`;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleDirection = 1;
    }

    update(mouseX, mouseY) {
        // Move star
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;

        // Twinkle effect
        this.brightness += this.twinkleSpeed * this.twinkleDirection;
        if (this.brightness > 1) {
            this.brightness = 1;
            this.twinkleDirection = -1;
        } else if (this.brightness < 0.3) {
            this.brightness = 0.3;
            this.twinkleDirection = 1;
        }
        this.color = `rgba(255, 255, 255, ${this.brightness})`;

        // Interact with mouse
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - distance) / 150;
                this.speedX -= Math.cos(angle) * force * 0.5;
                this.speedY -= Math.sin(angle) * force * 0.5;
                
                // Add some randomness to make it more interesting
                this.speedX += (Math.random() - 0.5) * 0.2;
                this.speedY += (Math.random() - 0.5) * 0.2;
                
                // Limit speed
                const maxSpeed = 2;
                const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
                if (currentSpeed > maxSpeed) {
                    this.speedX = (this.speedX / currentSpeed) * maxSpeed;
                    this.speedY = (this.speedY / currentSpeed) * maxSpeed;
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for brighter stars
        if (this.brightness > 0.7) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

class Nebula {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 200 + 100;
        this.color1 = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100 + 200)}, 0.1)`;
        this.color2 = `rgba(${Math.floor(Math.random() * 100 + 200)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100 + 100)}, 0.1)`;
        this.speedX = Math.random() * 0.05 - 0.025;
        this.speedY = Math.random() * 0.05 - 0.025;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.001;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x > this.canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = this.canvas.width + this.size;
        if (this.y > this.canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = this.canvas.height + this.size;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(1, this.color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class ShootingStar {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = 0;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 15 + 10;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 6;
        this.active = true;
        this.opacity = 1;
    }

    update() {
        if (!this.active) {
            if (Math.random() < 0.01) {
                this.reset();
            }
            return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.01;

        if (this.x > this.canvas.width || this.y > this.canvas.height || this.opacity <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
    }
}

// Initialize canvas and cosmic elements
function initCosmicAnimation() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let nebulas = [];
    let shootingStars = [];
    let mouseX = null;
    let mouseY = null;
    let lastTime = 0;
    let frameCount = 0;
    let fps = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const numberOfStars = Math.floor((canvas.width * canvas.height) / 1000);
        for (let i = 0; i < numberOfStars; i++) {
            stars.push(new Star(canvas));
        }
    }

    function createNebulas() {
        nebulas = [];
        const numberOfNebulas = Math.floor((canvas.width * canvas.height) / 100000) + 3;
        for (let i = 0; i < numberOfNebulas; i++) {
            nebulas.push(new Nebula(canvas));
        }
    }

    function createShootingStars() {
        shootingStars = [];
        const numberOfShootingStars = 3;
        for (let i = 0; i < numberOfShootingStars; i++) {
            shootingStars.push(new ShootingStar(canvas));
        }
    }

    function drawFPS() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(`FPS: ${fps}`, 10, 20);
    }

    function animate(currentTime) {
        // Calculate FPS
        frameCount++;
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
        }

        // Clear canvas with a slight trail effect
        ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw nebulas
        nebulas.forEach(nebula => {
            nebula.update();
            nebula.draw(ctx);
        });

        // Draw stars
        stars.forEach(star => {
            star.update(mouseX, mouseY);
            star.draw(ctx);
        });

        // Draw shooting stars
        shootingStars.forEach(star => {
            star.update();
            star.draw(ctx);
        });

        // Draw FPS counter
        drawFPS();

        requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
        createNebulas();
    });

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    // Initial setup
    resizeCanvas();
    createStars();
    createNebulas();
    createShootingStars();
    requestAnimationFrame(animate);
}

// Form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
        
        // Create a cool effect when submitting
        const button = form.querySelector('button');
        button.classList.add('glow');
        
        // Show a spooky dark-themed success message
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.top = '50%';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translate(-50%, -50%)';
        successMessage.style.padding = '20px 40px';
        successMessage.style.background = 'rgba(20, 20, 40, 0.9)';
        successMessage.style.borderRadius = '10px';
        successMessage.style.boxShadow = '0 0 30px rgba(100, 100, 255, 0.5)';
        successMessage.style.zIndex = '1000';
        successMessage.style.animation = 'glow 2s infinite alternate';
        successMessage.innerHTML = '<h2 style="color: #a0a0ff; margin-bottom: 10px;">Message Sent!</h2><p style="color: #c0c0ff;">Thank you for your message. This is a demo, so no data was actually sent.</p>';
        
        document.body.appendChild(successMessage);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(successMessage);
                button.classList.remove('glow');
            }, 500);
        }, 3000);
        
        form.reset();
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCosmicAnimation();
    initContactForm();
});