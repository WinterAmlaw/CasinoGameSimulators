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
      case 'red':
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

  
