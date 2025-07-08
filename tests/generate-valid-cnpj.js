// Helper script to generate valid alphanumeric CNPJs for testing
// This script calculates the correct verification digits for alphanumeric CNPJs

// Import the getCharValue function from the main code
function getCharValue(char) {
  const charCode = char.charCodeAt(0);
  // If it's a digit (0-9), return its numeric value
  if (charCode >= 48 && charCode <= 57) {
    return charCode - 48;
  }
  // If it's a letter, return ASCII code - 48
  return charCode - 48;
}

// Function to calculate verification digits for an alphanumeric CNPJ
function calculateVerificationDigits(cnpjBase) {
  if (cnpjBase.length !== 12) {
    throw new Error('CNPJ base must have 12 characters');
  }

  // Calculate first verification digit
  let sum = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    sum += getCharValue(cnpjBase.charAt(i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Calculate second verification digit
  sum = 0;
  pos = 6;
  for (let i = 0; i < 12; i++) {
    sum += getCharValue(cnpjBase.charAt(i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  sum += digit1 * 2; // Add first digit

  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return `${digit1}${digit2}`;
}

// Generate valid alphanumeric CNPJs
const cnpjBases = [
  'A1B2C3D4E5F6', // Example 1
  'XYZWABCDEFGH', // Example 2
  'PQR0STU1VWX2'  // Example 3
];

cnpjBases.forEach(base => {
  const digits = calculateVerificationDigits(base);
  const cnpj = base + digits;
  const formattedCnpj = cnpj.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '$1.$2.$3/$4-$5');
  console.log(`Base: ${base}`);
  console.log(`Verification digits: ${digits}`);
  console.log(`Valid CNPJ: ${cnpj}`);
  console.log(`Formatted CNPJ: ${formattedCnpj}`);
  console.log('---');
});