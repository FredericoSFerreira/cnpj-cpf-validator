/**
 * CPF/CNPJ Validator and Formatter
 * A TypeScript/JavaScript library for validating and formatting Brazilian CPF and CNPJ numbers
 *
 * CNPJ Format Support:
 * - Traditional numeric CNPJ (14 digits): XX.XXX.XXX/XXXX-XX
 * - New alphanumeric CNPJ format (effective July 2026):
 *   - 14 characters total
 *   - First 12 positions can contain letters and numbers
 *   - Last 2 positions (verification digits) remain numeric
 *   - Format: XX.XXX.XXX/XXXX-XX (can include letters)
 *   - Example: A1B2.C3D4.E5F6/G7H8-01
 *
 * The library supports both formats simultaneously, automatically detecting
 * which format is being used and applying the appropriate validation rules.
 */

/**
 * Removes all non-numeric characters from a string
 * @param value The string to clean
 * @returns A string containing only numbers
 */
export function cleanNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Removes all non-alphanumeric characters from a string
 * @param value The string to clean
 * @returns A string containing only letters and numbers
 */
export function cleanAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

// CPF Functions

/**
 * Validates if a CPF number is valid
 * @param cpf The CPF number to validate (can be formatted or just numbers)
 * @returns True if the CPF is valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cleanNumbers(cpf);

  // CPF must have 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleanCPF.charAt(9)) !== digit1) {
    return false;
  }

  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cleanCPF.charAt(10)) === digit2;
}

/**
 * Formats a CPF number with the standard mask (XXX.XXX.XXX-XX)
 * @param cpf The CPF number to format (can be formatted or just numbers)
 * @returns The formatted CPF or an empty string if invalid
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cleanNumbers(cpf);

  if (cleanCPF.length !== 11) {
    return '';
  }

  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Removes any non-numeric characters from a CPF
 * @param cpf The CPF to clean
 * @returns A string containing only the CPF numbers
 */
export function cleanCPF(cpf: string): string {
  return cleanNumbers(cpf);
}

// CNPJ Functions

/**
 * Converts a character to its numeric value for CNPJ validation
 * For digits: returns the digit value
 * For letters: returns ASCII code - 48 (as per new CNPJ rules)
 * @param char The character to convert
 * @returns The numeric value
 */
function getCharValue(char: string): number {
  const charCode = char.charCodeAt(0);
  // If it's a digit (0-9), return its numeric value
  if (charCode >= 48 && charCode <= 57) {
    return charCode - 48;
  }
  // If it's a letter, return ASCII code - 48
  return charCode - 48;
}

/**
 * Checks if a CNPJ is in the new alphanumeric format
 * @param cnpj The cleaned CNPJ string
 * @returns True if the CNPJ contains letters, false otherwise
 */
export function isAlphanumericCNPJ(cnpj: string): boolean {
  return /[a-zA-Z]/.test(cnpj);
}

/**
 * Validates if a CNPJ number is valid (supports both numeric and alphanumeric formats)
 * @param cnpj The CNPJ number to validate (can be formatted or just numbers/letters)
 * @returns True if the CNPJ is valid, false otherwise
 */
export function isValidCNPJ(cnpj: string): boolean {
  // First, determine if it's an alphanumeric CNPJ
  const hasLetters = /[a-zA-Z]/.test(cnpj);

  // Clean the CNPJ appropriately
  const cleanCNPJ = hasLetters ? cleanAlphanumeric(cnpj) : cleanNumbers(cnpj);

  // CNPJ must have 14 characters
  if (cleanCNPJ.length !== 14) {
    return false;
  }

  // For numeric CNPJs, check for known invalid CNPJs (all same digits)
  if (!hasLetters && /^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  // For alphanumeric CNPJs, the last two characters must be digits (verification digits)
  if (hasLetters && !/\d{2}$/.test(cleanCNPJ)) {
    return false;
  }

  // Validate first verification digit
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    // Use getCharValue for alphanumeric support
    const charValue = hasLetters
      ? getCharValue(numbers.charAt(size - i))
      : parseInt(numbers.charAt(size - i));

    sum += charValue * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  // Validate second verification digit
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    // Use getCharValue for alphanumeric support
    const charValue = hasLetters
      ? getCharValue(numbers.charAt(size - i))
      : parseInt(numbers.charAt(size - i));

    sum += charValue * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === parseInt(digits.charAt(1));
}

/**
 * Formats a CNPJ number with the standard mask (XX.XXX.XXX/XXXX-XX)
 * @param cnpj The CNPJ number to format (can be formatted or just numbers/letters)
 * @returns The formatted CNPJ or an empty string if invalid
 */
export function formatCNPJ(cnpj: string): string {
  // Check if the CNPJ has letters
  const hasLetters = /[a-zA-Z]/.test(cnpj);

  // Clean the CNPJ appropriately
  const cleanCNPJ = hasLetters ? cleanAlphanumeric(cnpj) : cleanNumbers(cnpj);

  if (cleanCNPJ.length !== 14) {
    return '';
  }

  // Apply the same mask pattern for both numeric and alphanumeric CNPJs
  return cleanCNPJ.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Cleans a CNPJ by removing formatting characters
 * For numeric CNPJs: removes all non-numeric characters
 * For alphanumeric CNPJs: removes all non-alphanumeric characters
 * @param cnpj The CNPJ to clean
 * @returns A cleaned CNPJ string
 */
export function cleanCNPJ(cnpj: string): string {
  // Check if the CNPJ has letters
  const hasLetters = /[a-zA-Z]/.test(cnpj);

  // Clean the CNPJ appropriately
  return hasLetters ? cleanAlphanumeric(cnpj) : cleanNumbers(cnpj);
}

// Combined Functions

/**
 * Validates if a document number is a valid CPF or CNPJ
 * @param document The document number to validate (can be formatted or just numbers/letters)
 * @returns True if the document is a valid CPF or CNPJ, false otherwise
 */
export function isValidDocument(document: string): boolean {
  // Check if the document has letters (potential alphanumeric CNPJ)
  const hasLetters = /[a-zA-Z]/.test(document);

  if (hasLetters) {
    // For documents with letters, we only support CNPJ validation
    const clean = cleanAlphanumeric(document);
    if (clean.length === 14) {
      return isValidCNPJ(document);
    }
    return false;
  } else {
    // For numeric documents, we support both CPF and CNPJ
    const clean = cleanNumbers(document);
    if (clean.length === 11) {
      return isValidCPF(clean);
    } else if (clean.length === 14) {
      return isValidCNPJ(clean);
    }
    return false;
  }
}

/**
 * Formats a document number as CPF or CNPJ based on its characteristics
 * @param document The document number to format (can be formatted or just numbers/letters)
 * @returns The formatted document or an empty string if invalid
 */
export function formatDocument(document: string): string {
  // Check if the document has letters (potential alphanumeric CNPJ)
  const hasLetters = /[a-zA-Z]/.test(document);

  if (hasLetters) {
    // For documents with letters, we only support CNPJ formatting
    const clean = cleanAlphanumeric(document);
    if (clean.length === 14) {
      return formatCNPJ(document);
    }
    return '';
  } else {
    // For numeric documents, we support both CPF and CNPJ
    const clean = cleanNumbers(document);
    if (clean.length === 11) {
      return formatCPF(clean);
    } else if (clean.length === 14) {
      return formatCNPJ(clean);
    }
    return '';
  }
}
