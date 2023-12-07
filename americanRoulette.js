class AmericanRoulette {
  constructor() {
    this.slots = Array.from({ length: 38 }, (_, i) => i < 37 ? i.toString() : '00');
  }

  spinWheel() {
    const outcomeIndex = Math.floor(Math.random() * this.slots.length);
    return this.slots[outcomeIndex];
  }

  isRed(number) {
    const redNumbers = ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
    return redNumbers.includes(number);
  }

  isBlack(number) {
    return !this.isRed(number) && number !== '0' && number !== '00';
  }

  bet(amount, betType, chosenNumber = null) {
    const outcome = this.spinWheel();
    let win = false;
    console.log(`NEW SPIN ---- Outcome: ${outcome}`);

    switch (betType) {
      case 'red':
        win = this.isRed(outcome);
        break;
      case 'black':
        win = this.isBlack(outcome);
        break;
      case 'number':
        win = outcome === chosenNumber;
        break;
      //Only vertical splits for now
      //For all bets on multiple numbers, select the lowest number in the desired area
      case 'split':
        win = outcome === chosenNumber || outcome === chosenNumber + 1;
        break;
      case 'street':
        win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 2;
        break;
      case 'corner':
        win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 3 || outcome === chosenNumber + 4;
        break;
      case 'line':
        win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 2 || outcome === chosenNumber + 3 || outcome === chosenNumber + 4 || outcome === chosenNumber + 5;
        break;
      case 'low':
        win = parseInt(outcome) >= 1 && parseInt(outcome) <= 18;
        break;
      case 'high':
        win = parseInt(outcome) >= 19 && parseInt(outcome) <= 36;
        break;
      case 'even':
        win = parseInt(outcome) % 2 === 0 && outcome !== '0' && outcome !== '00';
        break;
      case 'odd':
        win = parseInt(outcome) % 2 === 1;
        break;
      case 'dozen1':
        win = parseInt(outcome) >= 1 && parseInt(outcome) <= 12;
        break;
      case 'dozen2':
        win = parseInt(outcome) >= 13 && parseInt(outcome) <= 24;
        break;
      case 'dozen3':
        win = parseInt(outcome) >= 25 && parseInt(outcome) <= 36;
        break;
      case 'column1':
        win = parseInt(outcome) % 3 === 1;
        break;
      case 'column2':
        win = parseInt(outcome) % 3 === 2;
        break;
      case 'column3':
        win = parseInt(outcome) % 3 === 0 && outcome !== '0' && outcome !== '00';
        break;
    }

    if(win){
      console.log('Win!')
    } else {
      console.log('Loss');
    }

    return win ? amount * this.getPayout(betType) : -amount;
  }

  getPayout(betType) {
    switch (betType) {
      case 'number':
        return 35;
      case 'split':
        return 17;
      case 'street':
        return 11;  
      case 'corner':
        return 8;
      case 'line':
        return 5;
      case 'low':
        return 1;
      case 'high':
        return 1;
      case 'even':
        return 1;
      case 'odd':
        return 1;
      case 'red':
        return 1;
      case 'black':
        return 1;
      default:
        return 2; 
    }
  }
}

class RoulettePlayer {
  constructor(strategy, initialBet) {
    this.roulette = new AmericanRoulette();
    this.strategy = strategy;
    this.fibonacciSequence = [1, 1];
    this.initialBet = initialBet;
    this.betAmount = initialBet;
  }

  playRound(bets, initialBetAmount, maxBetAmount, bankroll) {
    let totalProfit = 0;
    let initialBet = this.initialBet;
    let betAmount = this.betAmount;
    // let maxBet = maxBetAmount || Infinity;
    // let bank = bankroll || Infinity;

    bets.forEach(bet => {
      console.log(betAmount);
      const profit = this.roulette.bet(betAmount, bet.type, bet.number);
      totalProfit += profit;
      // bank += profit;
      // if(profit > 0) {
      //   betAmount = initialBetAmount;
      //   this.fibonacciSequence = [1, 1];
      // } else {
        this.betAmount = this.updateBetAmount(profit, betAmount, initialBet);
      // }
      console.log(`Bet: $${betAmount} | Profit: $${profit}`);
      // if(betAmount > maxBet) betAmount = initialBetAmount;
      // console.log(bank);
      // if(bank <= 0) return 0;
    });

    return totalProfit;
  }

  updateBetAmount(profit, currentBet, initialBet) {
    if (profit < 0) {
      if (this.strategy === 'martingale') {
        return currentBet * 2;
      } else if (this.strategy === 'fibonacci') {
        this.fibonacciSequence.push(this.fibonacciSequence.at(-1) + this.fibonacciSequence.at(-2));
        return initialBet * this.fibonacciSequence.at(-1);
      }
    } else {
      currentBet = initialBet;
      this.fibonacciSequence = [0, 1];
    }
    return currentBet;
  }
}

function runSimulation() {
  const strategy = document.getElementById('strategy').value;
  const betType = document.getElementById('betType').value;
  const chosenNumber = betType === 'number' ? document.getElementById('chosenNumber').value : null;
  const initialBet = parseInt(document.getElementById('initialBet').value);
  const maxBet = parseInt(document.getElementById('maxBet').value);
  const spins = parseInt(document.getElementById('spins').value);

  const player = new RoulettePlayer(strategy, initialBet);
  let totalProfit = 0;

  for (let i = 0; i < spins; i++) {
      totalProfit += player.playRound([{ type: betType, number: chosenNumber }], initialBet, maxBet);
  }

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `Total Profit/Loss after ${spins} spins: $${totalProfit}`;
}

document.getElementById('betType').addEventListener('change', function() {
  const betType = this.value;
  const numberSelectionDiv = document.getElementById('numberSelection');
  if (betType === 'number') {
      numberSelectionDiv.style.display = '';
  } else {
      numberSelectionDiv.style.display = 'none';
  }
});


// console.log(`Total Profit/Loss after ${spins} spins: $${totalProfit}`);

  
