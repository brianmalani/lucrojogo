<script>
// Define global variables for game state
let bankroll = 4000; // Starting bankroll amount
let tokensLeft = 0; // Initial token count
let profit = 0; // Initial profit
let roundsPlayed = 0; // Initial rounds played count
let winMultiplier = 1; // Starting win multiplier
let stake = 200; // Initial stake amount

// Function to create game board
function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  for (let i = 0; i < 25; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = i + 1;
    card.addEventListener('click', () => revealCard(card));
    gameBoard.appendChild(card);
  }
}

// Function to reveal card
function revealCard(card) {
    const outcome = Math.random(); // Generate random outcome
    card.classList.add('revealed');
    if (outcome < 0.05) { // 5% chance of hitting a mine
      card.classList.add('mine');
      if (stake === initialStake) {
        tokensLeft--; // Deduct one token
        showMessage('Mine hit before cashing out on initial stake! Tokens left: ' + tokensLeft);
        bankroll -= initialStake; // Deduct initial stake from bankroll
        initialStake = 200; // Reset initial stake
      } else {
        tokensLeft--; // Deduct one token
        showMessage('Mine hit before cashing out on doubling the stake! Tokens left: ' + tokensLeft);
        bankroll -= stake; // Deduct stake from bankroll
        const newStakeInput = parseInt(prompt('Enter new stake (200):'));
            if (!isNaN(newStakeInput) && newStakeInput > 0) {
                stake = newStakeInput;
            } else {
                alert('Invalid stake amount. Using default halved stake.');
            }
        console.log('Stake reset to ' + stake);

      }
    } else {
      const maxWin = calculateMaxWin(roundsPlayed);
      const potentialWin = stake * winMultiplier;
      if (potentialWin < maxWin && winMultiplier < 2) {
        showMessage(`Coin marked! Round: ${roundsPlayed}, Stake: ${stake}, Potential Win: ${potentialWin.toFixed(2)}, Win multiplier: ${winMultiplier.toFixed(2)}`);
        winMultiplier += 0.2; // Increase win multiplier slightly
      } else {
        bankroll += potentialWin;
        showMessage(`Round won! Bankroll: ${bankroll}, Round: ${roundsPlayed}, Stake: ${stake}, Win multiplier: ${winMultiplier.toFixed(2)}`);
        console.log(`Round won! Bankroll: ${bankroll}, Round: ${roundsPlayed}, Stake: ${stake}, Win multiplier: ${winMultiplier.toFixed(2)}`);
        
        winMultiplier = 1; // Reset win multiplier for next round
        initialStake = stake * 2; // Set new initial stake for doubling
        stake = initialStake; // Reset stake to new initial stake

        // Reset game board
        resetGameBoard();
      }
    }
    roundsPlayed++;
    updateDashboard();
}

// Function to reset the game board
function resetGameBoard() {
    const gameBoard = document.getElementById('game-board');
    const cards = Array.from(document.getElementsByClassName('card'));
    cards.forEach(card => {
        card.classList.remove('revealed', 'mine');
    });
    shuffle(cards);
    gameBoard.innerHTML = '';
    cards.forEach(card => {
        card.addEventListener('click', () => revealCard(card));
        gameBoard.appendChild(card);
    });
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

  
// Function to calculate maximum win based on round number
function calculateMaxWin(round) {
  switch (round) {
    case 1:
      return 4466;
    case 2:
      return 11165;
    case 3:
      return 22330;
    case 4:
      return 44660;
    default:
      return Infinity; // No limit on max win after round 4
  }
}

// Function to update dashboard with current game state
function updateDashboard() {
  // Update UI elements with current game state
  document.getElementById('bankroll').textContent = bankroll;
  document.getElementById('tokens-left').textContent = tokensLeft;
  document.getElementById('rounds-played').textContent = roundsPlayed;
}

// Function to show message on screen
function showMessage(message) {
  const messageBox = document.getElementById('message-box');
  messageBox.textContent = message;
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 3000);
}

// Function to buy tokens
function buyTokens() {
  const stakeInput = parseInt(prompt('Enter stake for each token:'));
  if (!isNaN(stakeInput) && stakeInput > 0) {
    stake = stakeInput;
    tokensLeft += 10; // Buy 10 tokens
    bankroll -= 2000; // Deduct cost of tokens
    updateDashboard();
    showMessage('Stake set! Tokens bought: ' + tokensLeft);
  } else {
    alert('Please enter a valid stake amount.');
  }
}

// Function to play a round
function playRound() {
  const randomCardIndex = Math.floor(Math.random() * 25);
  const randomCard = document.getElementsByClassName('card')[randomCardIndex];
  revealCard(randomCard);
}

// Function to reset game
function resetGame() {
  profit = bankroll - 4000; // Calculate profit
  console.log('Game reset! Profit:', profit);

  // Return remaining tokens to bankroll
  bankroll += tokensLeft * stake;
  tokensLeft = 0;

  // Reset game state
  stake = 200;
  roundsPlayed = 0;
  winMultiplier = 1;

  updateDashboard();

  // Display message based on profit
  if (profit > 0) {
    alert(`Congratulations! You made a profit of ${profit} kwacha.`);
  } else {
    alert(`Try again later. You ended with a loss of ${Math.abs(profit)} kwacha.`);
  }
}

// Call createGameBoard function to initialize the game
createGameBoard();
</script>