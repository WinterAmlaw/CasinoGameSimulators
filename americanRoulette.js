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
      //I'm only doing vertical splits for now
      case 'split':
        win = outcome === chosenNumber || outcome === chosenNumber + 1;
        break;
      //select the first number in the street for this to work properly
      case 'street':
        win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 2;
        break;
      //Corner and line are not ready yet, algorithm needs to account for cases where the number is not the first in the selected area
      // case 'corner':
      //   win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 3 || outcome === chosenNumber + 4;
      //   break;
      // case 'line':
      //   win = outcome === chosenNumber || outcome === chosenNumber + 1 || outcome === chosenNumber + 2 || outcome === chosenNumber + 3 || outcome === chosenNumber + 4 || outcome === chosenNumber + 5;
      //   break;
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
  constructor(strategy) {
    this.roulette = new AmericanRoulette();
    this.strategy = strategy;
    this.fibonacciSequence = [1, 1];
  }

  playRound(bets, initialBetAmount) {
    let totalProfit = 0;
    let betAmount = initialBetAmount;

    bets.forEach(bet => {
      const profit = this.roulette.bet(betAmount, bet.type, bet.number);
      totalProfit += profit;
      betAmount = this.updateBetAmount(profit, betAmount);
    });

    return totalProfit;
  }

  updateBetAmount(profit, currentBet) {
    if (profit < 0) {
      if (this.strategy === 'martingale') {
        return currentBet * 2;
      } else if (this.strategy === 'fibonacci') {
        this.fibonacciSequence.push(this.fibonacciSequence.at(-1) + this.fibonacciSequence.at(-2));
        return this.fibonacciSequence.at(-1);
      }
    }
    return currentBet;
  }
}

const player = new RoulettePlayer('martingale');
let totalProfit = 0;
const initialBet = 10;
const spins = 100;
const bets = [{ type: 'dozen1' }, { type: 'dozen2' }];

for (let i = 0; i < spins; i++) {
  totalProfit += player.playRound(bets, initialBet);
}

console.log(`Total Profit/Loss after ${spins} spins: $${totalProfit}`);

  
