const cells = document.querySelectorAll(".cell");
const numBombs = document.querySelector("#num-bombs");
const playButton = document.querySelector("#play");
const cashoutButton = document.querySelector("#cashout");
cashoutButton.style.display = "none";
const balanceElement = document.querySelector("#balance");
const winningsElement = document.querySelector("#winnings");
const winningsContainer = document.querySelector("#winnings-container");
const betInput = document.querySelector("#bet");
let balance = 50;
let winnings = 0;
let bombsLeft = 0;
let moneyLeft = 0;
let bombIndices = [];
let isGameOver = true;
document.addEventListener("contextmenu", event => event.preventDefault());
const isCellClicked = Array(cells.length).fill(false);

function cashout() {
    balance += winnings;
    updateBalance();
    winnings = 0;
    updateWinnings();
    winningsContainer.style.display = "none";
    isGameOver = true;
    betInput.disabled = false;
    playButton.disabled = false;
    numBombs.disabled = false;
    updateCashoutButton();
    revealAll();
}

function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
}

function updateWinnings() {
    winningsElement.textContent = winnings.toFixed(2);
}

function updateBombsLeft() {
    const bombsLeftElement = document.querySelector("#bombs-left");
    bombsLeftElement.textContent = bombsLeft;
}

function updateMoneyLeft() {
    const moneyLeftElement = document.querySelector("#money-left");
    moneyLeftElement.textContent = Math.floor(moneyLeft);
}

function generateBombIndices(numBombs) {
    const indices = [];
    while (indices.length < numBombs) {
        const index = Math.floor(Math.random() * cells.length);
        if (!indices.includes(index)) {
            indices.push(index);
        }
    }
    return indices;
}

function updateCashoutButton() {
    if (isGameOver) {
        cashoutButton.style.display = "none";
    } else {
        cashoutButton.style.display = "inline-block";
    }
}

function revealAll() {
    cells.forEach((cell, index) => {
        if (bombIndices.includes(index)) {
            if (isCellClicked[index]) {
                cell.style.backgroundColor = "red";
            } else {
                cell.style.backgroundColor = "gray";
            }
            cell.innerHTML = "<span>💣</span>";
        } else {
            if (isCellClicked[index]) {
                cell.style.backgroundColor = "green";
            } else {
                cell.style.backgroundColor = "gray";
            }
            cell.innerHTML = "<span>💰</span>";
        }
    });
    document.querySelector("#cells-left-container").style.display = "none";
}

playButton.addEventListener("click", () => {
    isGameOver = false;
    betInput.disabled = true;
    playButton.disabled = true;
    numBombs.disabled = true;
    const betAmount = parseFloat(betInput.value);
    if (betAmount > balance) {
        alert("Insufficient balance!");
        return;
    }
    balance -= betAmount;
    winnings += betAmount;
    updateBalance();
    winningsContainer.style.display = "block";
    document.querySelector("#cells-left-container").style.display = "block";
    bombsLeft = parseInt(numBombs.value);
    moneyLeft = 25 - bombsLeft;
    updateBombsLeft();
    updateMoneyLeft();
    bombIndices = generateBombIndices(bombsLeft);
    cells.forEach((cell, index) => {
        cell.style.backgroundColor = "";
        cell.innerHTML = "";
        isCellClicked[index] = false;
    });
    cashoutButton.style.display = "none";
});

cashoutButton.addEventListener("click", cashout);

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (isGameOver || isCellClicked[index]) {
            return;
        }
        cashoutButton.style.display = "inline-block";
        isCellClicked[index] = true;
        if (bombIndices.includes(index)) {
            cell.style.backgroundColor = "red";
            cell.innerHTML = "<span>💣</span>";
            winnings = 0;
            updateWinnings();
            winningsContainer.style.display = "none";
            isGameOver = true;
            betInput.disabled = false;
            playButton.disabled = false;
            numBombs.disabled = false;
            updateCashoutButton();
            revealAll();
        } else {
            cell.style.backgroundColor = "green";
            cell.innerHTML = "<span>💰</span>";
            if (bombsLeft > 0) {
                updateBombsLeft();
            }
            moneyLeft -= 1;
            updateMoneyLeft();
            const betAmount = parseFloat(betInput.value);
            const multiplier = 1.05 + bombsLeft * 0.1;
            winnings *= multiplier;
            updateCashoutButton();
            updateWinnings();
            if (moneyLeft === 0) {
                cashout();
                isGameOver = true;
                betInput.disabled = false;
                playButton.disabled = false;
                numBombs.disabled = false;
                revealAll();
            }
        }
    });
});