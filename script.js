const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startButton = document.getElementById('startGame');
const difficultySelector = document.getElementById('difficulty');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');
const winnerMessage = document.getElementById('winnerMessage');
const goToMenuButton = document.getElementById('goToMenu');
const iconSelection = document.getElementById('iconSelection');
const scoreboard = document.querySelector('.scoreboard');

// Nueva variable para el contador y mensajes
let countdownText = document.createElement('div');
countdownText.id = 'countdownText';
countdownText.style.position = 'absolute';
countdownText.style.top = '50%';
countdownText.style.left = '50%';
countdownText.style.transform = 'translate(-50%, -50%)';
countdownText.style.fontSize = '40px';
countdownText.style.color = 'white';
countdownText.style.display = 'none'; // Se oculta inicialmente
document.body.appendChild(countdownText);

// Nueva variable para controlar si ya se mostró el mensaje de inicio
let startMessageShown = false;

// Variables del juego
let playerY = canvas.height / 2 - 50;
let computerY = canvas.height / 2 - 50;
const paddleHeight = 100;
const paddleWidth = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
let paddleSpeed = 6;
let computerSpeed = 3; // Velocidad de la computadora
let selectedIcon = ''; // Variable para almacenar el ícono seleccionado
let playerIcon = new Image(); // Cambiamos a una imagen
let isPaused = false; // Variable para controlar si el juego está pausado

// Marcadores
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;

// Variables de control
let upPressed = false;
let downPressed = false;
let difficulty = 'medium';
let animationId; // Variable para almacenar el ID de la animación

// Iniciar el juego
startButton.addEventListener('click', startIconSelection);
goToMenuButton.addEventListener('click', returnToMenu);
document.getElementById("startGame").addEventListener("click", function() {
    var backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.play();  // Inicia la música
});

var isMuted = false; // Estado de la música

document.getElementById("muteButton").addEventListener("click", function() {
    var backgroundMusic = document.getElementById("backgroundMusic");

    if (!isMuted) {
        backgroundMusic.pause(); // Silencia la música
        this.textContent = "Activar Música"; // Cambia el texto del botón
    } else {
        backgroundMusic.play(); // Reactiva la música
        this.textContent = "Silenciar Música"; // Cambia el texto del botón
    }

    isMuted = !isMuted; // Cambia el estado de mute
});
document.getElementById("infoIcon").addEventListener("click", function() {
    document.getElementById("helpMessage").style.display = "block";
});

document.getElementById("closeHelp").addEventListener("click", function() {
    document.getElementById("helpMessage").style.display = "none";
});

function startIconSelection() {
    menu.style.display = 'none';
    iconSelection.style.display = 'block';
}

function selectIcon(icon) {
    selectedIcon = icon; // Guarda el ícono seleccionado
    const icons = document.querySelectorAll('.icon'); // Obtiene todos los íconos
    icons.forEach(iconElement => {
        iconElement.classList.remove('selected'); // Quita la clase 'selected' de todos los íconos
    });
    // Añade la clase 'selected' al ícono que fue clickeado
    const selectedIconElement = Array.from(icons).find(iconElement => iconElement.src.includes(icon));
    if (selectedIconElement) {
        selectedIconElement.classList.add('selected');
    }
    document.getElementById('acceptIcon').disabled = false; // Habilita el botón de aceptar
}

document.getElementById('acceptIcon').addEventListener('click', () => {
    playerIcon.src = selectedIcon; // Asigna el ícono seleccionado a playerIcon
    iconSelection.style.display = 'none';
    displayStartMessage();
});

// Muestra el mensaje de inicio y cuenta regresiva
function displayStartMessage() {
    canvas.style.display = 'block';  // Asegúrate de que el canvas sea visible
    scoreboard.style.display = 'block';  // Asegúrate de que el marcador también sea visible

    if (!startMessageShown) { // Solo muestra el mensaje si no se ha mostrado antes
        countdownText.textContent = "El primero en hacer 5 puntos gana";
        countdownText.style.display = 'block';

        // Mostrar mensaje durante 2 segundos, luego iniciar la cuenta regresiva
        setTimeout(() => {
            startCountdown(3); // Iniciar cuenta regresiva de 3 segundos
        }, 2000);
        startMessageShown = true; // Marca como mostrado
    } else {
        startCountdown(3); // Si ya se mostró, solo inicia la cuenta regresiva
    }
}

document.getElementById('backToMenuButton').addEventListener('click', () => {
    // Asegúrate de pausar el juego antes de regresar al menú principal
    pauseGame();

    // Ocultar todo el contenido relacionado con el juego
    document.getElementById('pauseMenu').style.display = 'none'; // Oculta el menú de pausa
    canvas.style.display = 'none';  // Ocultar el canvas
    scoreboard.style.display = 'none';  // Ocultar el marcador
    countdownText.style.display = 'none';  // Ocultar el texto de cuenta regresiva si está visible

    // Reiniciar las variables y el estado del juego para evitar problemas
    resetGame(); // Opcional, si deseas resetear el juego completamente
    cancelAnimationFrame(animationId); // Asegurarte de detener la animación si está activa

    // Mostrar el menú principal
    menu.style.display = 'flex';  // Volver a mostrar el menú principal
    iconSelection.style.display = 'none';  // Asegurarse de que la selección de iconos no esté visible
});
// Función para iniciar la cuenta regresiva
function startCountdown(seconds) {
    countdownText.textContent = seconds;
    countdownText.style.display = 'block'; // Asegurarse de que se vea el contador

    const countdownInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            countdownText.textContent = seconds;
        } else {
            clearInterval(countdownInterval);
            countdownText.style.display = 'none'; // Ocultar el texto de cuenta regresiva
            resetGame(); // Reinicia el juego correctamente
            startGame(); // Iniciar el juego cuando la cuenta llegue a 1
            document.getElementById('menuButton').style.display = 'block'; // Hacer visible el botón de menú
            document.getElementById('pauseContent').style.display = 'block'; // Hacer visible el botón de menú

        }
    }, 1000);
}

// Resetea las posiciones y variables del juego
function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.abs(ballSpeedX); // Asegúrate de que la velocidad sea la correcta
    playerScore = 0;
    computerScore = 0;
    startMessageShown = false; // Permitir que se vuelva a mostrar el mensaje
}

function startGame() {
    setDifficulty(difficultySelector.value);
    gameLoop(); // Llamar al bucle del juego
}

let failRate = 0;

// Colores de las raquetas según el ícono seleccionado
// Función para obtener los colores de la raqueta según el ícono seleccionado
function getPaddleColor() {
    switch (selectedIcon) {
        case 'mexico.png': // México
            return ['#00843D', 'white', '#BF2E2E']; // Verde, blanco, rojo
        case 'argentina.png': // Argentina
            return ['#00A3E0', 'white', '#00A3E0']; // Celeste, blanco, amarillo
        case 'espana.png': // España
            return ['#FCD300', '#C8102E', '#FFD700']; // Amarillo, rojo, dorado (amarillo y rojo)
        case 'colombia.png': // Colombia
            return ['#FCD300', '#0033A0', '#CE1126']; // Amarillo, azul, rojo
        case 'francia.png': // Francia
            return ['#0055A4', '#FFFFFF', '#EF4135']; // Azul, blanco, rojo
        case 'alemania.png': // Alemania
            return ['#000000', '#FF0000', '#FCD300']; // Negro, rojo, dorado
        case 'bolivia.png': // Bolivia
            return ['#FF0000', '#FFD700', '#00843D']; // Rojo, amarillo, verde
        default:
            return ['white', 'white', 'white']; // Color por defecto
    }
}

function setDifficulty(level) {
    switch (level) {
        case 'easy':
            ballSpeedX = 4;
            ballSpeedY = 4;
            computerSpeed = 2;
            failRate = 0.9; 
            break;
        case 'medium':
            ballSpeedX = 6;
            ballSpeedY = 6;
            computerSpeed = 6;
            failRate = 0.5; 
            break;
        case 'hard':
            ballSpeedX = 8;
            ballSpeedY = 8;
            computerSpeed = 1;
            failRate = 0.3; 
            break;
    }
}

// Controlar la raqueta con el teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePause(); // Alterna entre pausar y reanudar el juego
    }
    if (event.key === 'ArrowUp') upPressed = true;
    if (event.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') upPressed = false;
    if (event.key === 'ArrowDown') downPressed = false;
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') upPressed = true;
    if (event.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') upPressed = false;
    if (event.key === 'ArrowDown') downPressed = false;
});

// Controlar la raqueta con el ratón
canvas.addEventListener('mousemove', (event) => {
    const canvasPosition = canvas.getBoundingClientRect();
    playerY = event.clientY - canvasPosition.top - paddleHeight / 2;
});

function gameLoop() {
    if (playerScore >= winningScore || computerScore >= winningScore) {
        displayWinner();
        return;
    }

    if (isPaused) return; // Si está pausado, no ejecutar el bucle

    // Movimiento del jugador
    if (upPressed && playerY > 0) playerY -= paddleSpeed;
    if (downPressed && playerY < canvas.height - paddleHeight) playerY += paddleSpeed;

    // Movimiento de la computadora
    if (computerY + paddleHeight / 2 < ballY) computerY += computerSpeed;
    if (computerY + paddleHeight / 2 > ballY) computerY -= computerSpeed;

    // Movimiento de la bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebote en las paredes superior e inferior
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

    // Rebote en las raquetas
    if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX >= canvas.width - paddleWidth && ballY >= computerY && ballY <= computerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Punto para la computadora
    if (ballX <= 0) {
        computerScore++;
        resetBall();
    }

    // Punto para el jugador
    if (ballX >= canvas.width) {
        playerScore++;
        resetBall();
    }

    drawEverything();
    animationId = requestAnimationFrame(gameLoop); // Guarda el ID de la animación
}

// Agregar evento al botón Menú
document.getElementById('menuButton').addEventListener('click', togglePause);

// Función para pausar o reanudar el juego
function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// Función para pausar el juego
function pauseGame() {
    isPaused = true;
    cancelAnimationFrame(animationId); // Detener el bucle de animación
    document.getElementById('pauseMenu').style.display = 'flex'; // Mostrar el menú de pausa
}

// Función para reanudar el juego
function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').style.display = 'none'; // Ocultar el menú de pausa
    gameLoop(); // Reiniciar el bucle de animación
}

// Agregar evento para reiniciar el juego
document.getElementById('restartButton').addEventListener('click', restartGame);

// Agregar evento para reanudar el juego al hacer clic fuera del menú
document.getElementById('pauseMenu').addEventListener('click', (event) => {
    if (event.target === document.getElementById('pauseMenu')) {
        resumeGame(); // Reanudar si se hace clic fuera del contenido del menú
    }
});



// Función para reiniciar el juego
function restartGame() {
    resetGame(); // Resetear los valores del juego
    countdownText.style.display = 'block'; // Mostrar texto de cuenta regresiva
    isPaused = false;  // Asegurarse de que el juego no esté pausado al reiniciar
    displayStartMessage(); // Reiniciar el juego y mostrar el mensaje de inicio
}
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function displayWinner() {
    winnerMessage.textContent = playerScore >= winningScore ? '¡Ganaste!' : '¡La máquina ganó!';
    winnerAnnouncement.style.display = 'flex';
    canvas.style.display = 'none';
}

// Función para volver al menú
function returnToMenu() {
    winnerAnnouncement.style.display = 'none';
    menu.style.display = 'flex';
    isPaused = false;  // Asegurarse de que el juego no esté pausado al volver al menú
    resetGame(); // Resetea el estado del juego
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Colores de la raqueta según el ícono seleccionado
    const colors = getPaddleColor();
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillStyle = colors[1]; // Cambiar al segundo color
    ctx.fillRect(0, playerY + paddleHeight / 3, paddleWidth, paddleHeight / 3); // Sección blanca
    ctx.fillStyle = colors[2]; // Cambiar al tercer color
    ctx.fillRect(0, playerY + 2 * paddleHeight / 3, paddleWidth, paddleHeight / 3); // Sección final

    // Raqueta de la computadora
    ctx.fillStyle = 'green'; // Puedes cambiar el color de la raqueta de la computadora
    ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);

    // Bola
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    // Dibuja el marcador
    drawScore();
}

function drawScore() {
    // Dibuja el marcador
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Jugador: ${playerScore} - Computadora: ${computerScore}`, canvas.width / 2 - 100, 30);

    // Dibuja el ícono del jugador al lado del marcador
    if (selectedIcon) {
        ctx.drawImage(playerIcon, canvas.width / 2 - 200, 5, 30, 30); // Coloca el ícono cerca del marcador
    }
}