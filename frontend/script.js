const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake, food, dx, dy, score, gameInterval, speed;

// Start Game
function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = randomFood();
    dx = 1;
    dy = 0;
    score = 0;
    speed = 200; // slower start

    document.getElementById("score").innerText = "Score: 0";

    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

// Random Food
function randomFood() {
    return {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

// Draw Game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Snake glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";

    ctx.fillStyle = "#00ffcc";
    snake.forEach(part => {
        ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
    });

    // Food glow
    ctx.shadowColor = "#ff0055";
    ctx.fillStyle = "#ff0055";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Wall collision
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20) {
        gameOver();
        return;
    }

    // Self collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            gameOver();
            return;
        }
    }

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        food = randomFood();

        // Increase speed slowly
        clearInterval(gameInterval);
        speed = Math.max(80, speed - 5);
        gameInterval = setInterval(draw, speed);

    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Controls
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0; dy = -1;
    }
    if (e.key === "ArrowDown" && dy === 0) {
        dx = 0; dy = 1;
    }
    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -1; dy = 0;
    }
    if (e.key === "ArrowRight" && dx === 0) {
        dx = 1; dy = 0;
    }
});

// Game Over
function gameOver() {
    clearInterval(gameInterval);

    let name = prompt("Game Over! Enter your name:");
    if (name) {
        saveScore(name, score);
    }
}

// Save Score
function saveScore(name, score) {
    fetch("http://localhost:5000/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, score })
    })
    .then(() => loadLeaderboard());
}

// Load Leaderboard
function loadLeaderboard() {
    fetch("http://localhost:5000/scores")
        .then(res => res.json())
        .then(data => {
            let list = document.getElementById("leaderboard");
            list.innerHTML = "";

            data.slice(0, 5).forEach(player => {
                let li = document.createElement("li");
                li.innerText = `${player.name}: ${player.score}`;
                list.appendChild(li);
            });
        });
}

loadLeaderboard();