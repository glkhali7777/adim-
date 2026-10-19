import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTraderProfit,
  calculateHouseGGR,
  validateBetAmount,
  calculateDepositBonus,
  calculateWinRate,
  formatBRL
} from './brokerCalculations.ts';

test('calculateTraderProfit returns correct profit for stake and payout %', () => {
  assert.equal(calculateTraderProfit(100, 92), 92);
  assert.equal(calculateTraderProfit(50, 85), 42.5);
  assert.equal(calculateTraderProfit(250, 95), 237.5);
  assert.equal(calculateTraderProfit(0, 90), 0);
  assert.equal(calculateTraderProfit(-10, 90), 0);
});

test('calculateHouseGGR calculates net gaming revenue correctly', () => {
  assert.equal(calculateHouseGGR(10000, 8500), 1500);
  assert.equal(calculateHouseGGR(50000, 48000), 2000);
  assert.equal(calculateHouseGGR(5000, 5200), -200);
});

test('validateBetAmount handles bounds and invalid amounts', () => {
  const min = 5;
  const max = 10000;
  
  assert.equal(validateBetAmount(10, min, max).valid, true);
  assert.equal(validateBetAmount(5, min, max).valid, true);
  assert.equal(validateBetAmount(10000, min, max).valid, true);
  
  assert.equal(validateBetAmount(4.99, min, max).valid, false);
  assert.equal(validateBetAmount(10000.01, min, max).valid, false);
  assert.equal(validateBetAmount(-50, min, max).valid, false);
  assert.equal(validateBetAmount(NaN, min, max).valid, false);
});

test('calculateDepositBonus calculates bonus with cap', () => {
  assert.equal(calculateDepositBonus(100, 50, 5000), 50);
  assert.equal(calculateDepositBonus(500, 100, 5000), 500);
  assert.equal(calculateDepositBonus(20000, 50, 5000), 5000); // capped at 5000
});

test('calculateWinRate calculates correct percentage', () => {
  assert.equal(calculateWinRate(6, 10), 60);
  assert.equal(calculateWinRate(1, 3), 33.3);
  assert.equal(calculateWinRate(0, 0), 0);
});

test('formatBRL formats Brazilian Real currency strings', () => {
  const formatted = formatBRL(1000);
  assert.ok(formatted.includes('1.000,00'));
});
