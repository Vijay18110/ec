

export function convertToINRFormat(number) {
  if (isNaN(number)) {
    return 0.0; //"Invalid Number";
  }

  // Handle negative numbers
  const isNegative = number < 0;
  number = Math.abs(number);

  // Convert the number to a string and split integer and decimal parts
  const parts = number.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? "." + parts[1] : "";

  // Apply Indian numbering format for the integer part
  let lastThreeDigits = integerPart.slice(-3);
  let remainingDigits = integerPart.slice(0, -3);

  if (remainingDigits.length > 0) {
    remainingDigits = remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    lastThreeDigits = remainingDigits + "," + lastThreeDigits;
  }

  const formattedNumber = lastThreeDigits + decimalPart;
  return (isNegative ? "-" : "") + "₹" + formattedNumber;
}
