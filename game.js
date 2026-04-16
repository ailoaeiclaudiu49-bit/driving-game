const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

// Mobile Controls Mapping
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnBrake = document.getElementById('btnBrake');
const btnAccel = document.getElementById('btnAccel');

function bindButton(btn, keyName) {
    btn.addEventListener('mousedown', () => keys[keyName] = true);
    btn.addEventListener('mouseup', () => keys[keyName] = false);
    btn.addEventListener('mouseleave', () => keys[keyName] = false);
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior like scrolling
        keys[keyName] = true;
    });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys[keyName] = false;
    });
}

bindButton(btnLeft, 'ArrowLeft');
bindButton(btnRight, 'ArrowRight');
bindButton(btnBrake, 'ArrowDown');
bindButton(btnAccel, 'ArrowUp');

const car = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 150,
    width: 30,
    height: 50,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.2,
    friction: 0.05,
    angle: 0,
    turnSpeed: 0.05
};

let lastTime = 0;

function update(deltaTime) {
    // Forward / Backward
    if (keys.ArrowUp) {
        car.speed += car.acceleration;
    }
    if (keys.ArrowDown) {
        car.speed -= car.acceleration;
    }

    // Apply friction
    if (car.speed > 0) {
        car.speed -= car.friction;
    }
    if (car.speed < 0) {
        car.speed += car.friction;
    }

    // Stop completely if very slow to avoid sliding forever
    if (Math.abs(car.speed) < car.friction) {
        car.speed = 0;
    }

    // Cap speed
    if (car.speed > car.maxSpeed) {
        car.speed = car.maxSpeed;
    }
    if (car.speed < -car.maxSpeed / 2) {
        car.speed = -car.maxSpeed / 2; // reverse speed limit
    }

    // Turning (only if moving)
    if (car.speed !== 0) {
        const flip = car.speed > 0 ? 1 : -1;
        if (keys.ArrowLeft) {
            car.angle -= car.turnSpeed * flip;
        }
        if (keys.ArrowRight) {
            car.angle += car.turnSpeed * flip;
        }
    }

    // Update position
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed; // y decreases as we go up
}

function drawTrack() {
    // Basic track grass
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Track road
    ctx.fillStyle = '#7f8c8d';
    // Draw a simple oval track
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 300, 200, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Track inner grass
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 200, 100, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Start line
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width / 2 - 5, canvas.height / 2 + 100, 10, 100);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background track
    drawTrack();

    // Draw car
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);

    ctx.fillStyle = 'red';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

    // Draw front of the car to see direction
    ctx.fillStyle = 'black';
    ctx.fillRect(-car.width / 2 + 5, -car.height / 2 + 5, car.width - 10, 10);

    ctx.restore();
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
