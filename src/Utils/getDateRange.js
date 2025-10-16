export const getLastThreeFullMonthsRange = () => {
  const today = new Date();

  // TO DATE: Last day of previous month
  const toDate = new Date(today.getFullYear(), today.getMonth(), 0);

  // FROM DATE: First day of the month, three months before current month
  const fromDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  return {
    from: formatDate(fromDate),
    to: formatDate(toDate),
  };
 
};