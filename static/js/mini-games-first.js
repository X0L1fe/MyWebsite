document.addEventListener("DOMContentLoaded", function () {
    feather.replace();
});
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scoreElement = document.getElementById('score');

var animationFrameId;

var grid = 16;
var count = 0;
var score = 0;

var tips = [
    "Не разворачивайтесь резко, это может привести к столкновению!",
    "Старайтесь планировать движение на несколько ходов вперёд.",
    "Используйте стены как инструмент для безопасных разворотов.",
    "Старайтесь не загонять себя в углы, оставляйте пути для выхода.",
    "Чем длиннее змейка, тем важнее сохранять спокойствие.",
    "Не гонись за яблоком сразу, иногда лучше подождать.",
    "Учись предугадывать своё следующее движение заранее.",
    "Собирайте яблоки по порядку, избегая опасных маневров.",
    "Змейка ускоряется, чем больше её длина — будьте внимательнее!",
    "Используй всё пространство поля для оптимального движения."
];
var currentTipIndex = 0;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    showNextTip();
}

function checkWin() {
    if (score >= 5) {
        showModal('winModal');
    }
}

function loop() {
    animationFrameId = requestAnimationFrame(loop);

    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            scoreElement.textContent = score;

            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;

            checkWin();
        }

        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                showModal('gameOverModal'); // Показываем модальное окно при столкновении
                cancelAnimationFrame(loop);
            }
        }
    });
}

function showNextTip() {
    var tipElement = document.getElementById('gameOverTip'); // Элемент, куда будет выводиться совет
    tipElement.textContent = tips[currentTipIndex]; // Устанавливаем текст совета

    // Обновляем индекс для показа следующего совета в будущем
    currentTipIndex++;
    if (currentTipIndex >= tips.length) {
        currentTipIndex = 0; // Если советы закончились, начинаем сначала
    }
}
// Функция для показа модальных окон
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Функция для скрытия модальных окон
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.focus();
}

// События кнопок
document.getElementById('startGameBtn').addEventListener('click', function () {
    hideModal('welcomeModal');
    requestAnimationFrame(loop);
});

document.getElementById('retryBtn').addEventListener('click', function () {
    hideModal('gameOverModal');
    resetGame();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(loop)
});

document.getElementById('exitBtn').addEventListener('click', function () {
    window.location.href = '/';
});

document.getElementById('replayBtn').addEventListener('click', function () {
    hideModal('winModal');
    resetGame();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(loop)
});

document.getElementById('exitWinBtn').addEventListener('click', function () {
    window.location.href = '/';
});

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});
// Показ приветственного окна при загрузке страницы
showModal('welcomeModal');