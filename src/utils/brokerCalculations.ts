/**
 * Pure calculation and validation logic for Broker QX platform
 */

export interface BetValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Calculates trader's net profit on a winning trade
 * @param stake Amount invested in the trade
 * @param payoutPercent Payout percentage (e.g. 92 for 92%)
 */
export function calculateTraderProfit(stake: number, payoutPercent: number): number {
  if (stake <= 0 || payoutPercent <= 0) return 0;
  return Math.round((stake * (payoutPercent / 100)) * 100) / 100;
}

/**
 * Calculates the House Net Revenue (GGR) from volume and payouts
 * @param totalTurnover Total amount wagered by traders
 * @param totalTraderPayouts Total payouts returned to traders
 */
export function calculateHouseGGR(totalTurnover: number, totalTraderPayouts: number): number {
  return Math.round((totalTurnover - totalTraderPayouts) * 100) / 100;
}

/**
 * Validates bet size against asset minimum and maximum parameters
 */
export function validateBetAmount(amount: number, minBet: number, maxBet: number): BetValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Valor da operação deve ser maior que zero.' };
  }
  if (amount < minBet) {
    return { valid: false, error: `Valor mínimo por operação é de R$ ${minBet.toFixed(2)}.` };
  }
  if (amount > maxBet) {
    return { valid: false, error: `Valor máximo por operação é de R$ ${maxBet.toFixed(2)}.` };
  }
  return { valid: true };
}

/**
 * Calculates matching deposit bonus
 */
export function calculateDepositBonus(depositAmount: number, bonusPercentage: number, maxBonus: number = 5000): number {
  if (depositAmount <= 0 || bonusPercentage <= 0) return 0;
  const rawBonus = depositAmount * (bonusPercentage / 100);
  return Math.min(Math.round(rawBonus * 100) / 100, maxBonus);
}

/**
 * Calculates win rate percentage
 */
export function calculateWinRate(winningTrades: number, totalTrades: number): number {
  if (totalTrades <= 0) return 0;
  return Math.round((winningTrades / totalTrades) * 1000) / 10;
}

/**
 * Formats a number to Brazilian Real currency format
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formats a number to Tether USDT currency format
 */
export function formatUSDT(value: number): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} USDT`;
}
