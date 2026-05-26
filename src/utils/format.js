export const formatMoney = (amount) => {
  const truncated = Math.floor(amount * 100) / 100;
  return truncated.toFixed(2);
};