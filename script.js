document.addEventListener('DOMContentLoaded', function () {
    const basket = document.querySelector('.basket');
    const gold = document.querySelector('.gold');
    const bomb = document.querySelector('.bomb');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    let score = 0;
    let timer = 0; // Initial timer value in seconds

    // Audio for gold collection
    const collectSound = new Audio('assets/collectSound.wav');
    const bombSound = new Audio('assets/bomb.wav');

    // Move basket left and right with arrow keys
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            moveBasket(-20);
        } else if (event.key === 'ArrowRight') {
            moveBasket(20);
        }
    });

    // Function to move the basket
    function moveBasket(offset) {
        const currentLeft = parseInt(getComputedStyle(basket).left);
        const newLeft = Math.min(Math.max(currentLeft + offset, 0), window.innerWidth - basket.offsetWidth);
        basket.style.left = newLeft + 'px';
    }

    // Update the score when gold is caught
    function updateScore(goldSize) {
        // Assign points based on gold size
        let points = 0;
        if (goldSize >= 20 && goldSize < 30) {
            points = 10; // Assign 10 points for small gold
        } else if (goldSize >= 30 && goldSize < 40) {
            points = 20; // Assign 20 points for medium gold
        } else if (goldSize >= 40) {
            points = 30; // Assign 30 points for large gold
        }
        
        gold.classList.add('collected');

    // Show the explosion
        showExplosion();

        setTimeout(() => {
            gold.classList.remove('collected');
            hideExplosion();
        }, 1000); // Adjust the duration in milliseconds

        score += points;
        scoreElement.textContent = score;
        playCollectSound(); // Play the sound when gold is collected
    }

    // Play sound when gold is collected
    function playCollectSound() {
        collectSound.currentTime = 0; // Reset the sound to the beginning
        collectSound.play();
    }

    function deductScore() {
        score -= 10;
        scoreElement.textContent = score;

    }

    // Check for collision between basket and gold
    function checkCollision() {
        const basketRect = basket.getBoundingClientRect();
        const goldRect = gold.getBoundingClientRect();
        const bombRect = bomb.getBoundingClientRect();

        if (
            basketRect.bottom >= goldRect.top &&
            basketRect.top <= goldRect.bottom &&
            basketRect.right >= goldRect.left &&
            basketRect.left <= goldRect.right
        ) {
            // Gold caught
            updateScore(parseInt(gold.style.width)); // Pass the gold size to updateScore
            resetGold();
        } else if (
            basketRect.bottom >= bombRect.top &&
            basketRect.top <= bombRect.bottom &&
            basketRect.right >= bombRect.left &&
            basketRect.left <= bombRect.right
        ) {
            deductScore();
            bombSound.currentTime = 0;
            bombSound.play();
            resetBomb();
        }
    }

    // Reset the position and size of the gold
    function resetGold() {
        const maxHeight = window.innerHeight - gold.offsetHeight;
        const randomX = Math.random() * (window.innerWidth - gold.offsetWidth);

        // Generate random size for gold (between 20 and 50 pixels)
        const randomSize = Math.floor(Math.random() * (50 - 20 + 1)) + 20;

        gold.style.top = '0';
        gold.style.left = randomX + 'px';
        gold.style.width = randomSize + 'px';
        gold.style.height = randomSize + 'px';
    }

    function resetBomb() {
        const maxHeight = window.innerHeight - bomb.offsetHeight;
        const randomX = Math.random() * (window.innerWidth - bomb.offsetWidth);

        bomb.style.top = '0';
        bomb.style.left = randomX + 'px';
    }

    // Update the position of the falling gold
    function updateGoldPosition() {
        const currentTop = parseInt(getComputedStyle(gold).top);
        const newTop = currentTop + 5; // Adjust the speed as needed
        gold.style.top = newTop + 'px';

        // Check if gold is out of the screen
        if (newTop > window.innerHeight) {
            resetGold();
        }

        checkCollision();
    }

    function updateBombPosition() {
        const currentTop = parseInt(getComputedStyle(bomb).top);
        const newTop = currentTop + 5; // Adjust the speed as needed
        bomb.style.top = newTop + 'px';

        // Check if gold is out of the screen
        if (newTop > window.innerHeight) {
            resetBomb();
        }

        checkCollision();
    }

    function showExplosion() {
        const explosion = document.querySelector('.explosion');
        const bombRect = bomb.getBoundingClientRect();

    // Position the explosion at the center of the bomb
        explosion.style.top = bombRect.top + 'px';
        explosion.style.left = bombRect.left + 'px';

        explosion.style.display = 'block';
    }

    function hideExplosion() {
        const explosion = document.querySelector('.explosion');
        explosion.style.display = 'none';
    }

    // Update the countdown timer
    function updateTimer() {
        timer++;
        timerElement.textContent = timer;

        if (timer === 0) {
            endGame();
        }
    }

    // End the game and display a message
    function endGame() {
        alert('Game Over! Your final score is ' + score);
        // You can add more actions here, like restarting the game or redirecting to another page.
    }

    // Game loop
    function gameLoop() {
        updateGoldPosition();
        updateBombPosition();
        updateTimer();

        if (score >= 0) {
            requestAnimationFrame(gameLoop);
        } else {
            endGame();
        }
    }

    // Start the game loop
    gameLoop();
});
