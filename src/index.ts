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
 * @param maskMode Activates formatting gradually
 * @returns The formatted CPF or an empty string if invalid
 */
export function formatCPF(cpf: string, maskMode: boolean = false): string {
  // Clean the CPF appropriately
  const cleanCPF = cleanNumbers(cpf);

  // CPF size clean
  const size = cleanCPF.length;

  // Gradual formatting based on user input
  if (maskMode) {

    // "5", "52" or "529"
    if (size <= 3) return cleanCPF;
    // "529.9", "529.98" or "529.982"
    if (size <= 6) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`;
    // "529.982.2", "529.982.24" or "529.982.247"
    if (size <= 9) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`;
    // Invalid
    if (size > 11) return '';

  } else if (size !== 11) {
    // Invalid
    return '';
  }

  const pattern = maskMode
    ? /(\d{3})(\d{3})(\d{3})(\d{1,2})/ // "529.982.247-2" or "529.982.247-25"
    : /(\d{3})(\d{3})(\d{3})(\d{2})/ // Only "529.982.247-25"

  return cleanCPF.replace(pattern, '$1.$2.$3-$4');
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
 * 
 * Conforme documentação da Receita Federal do Brasil e Serpro:
 * Para cada um dos caracteres do CNPJ, atribuir o valor da coluna "Valor para cálculo do DV",
 * obtido subtraindo 48 do código ASCII do caractere.
 * 
 * @param char The character to convert
 * @returns The numeric value
 */
function getCharValue(char: string): number {
  const charCode = char.charCodeAt(0);
  return charCode - 48; // Subtrair 48 do código ASCII conforme documentação oficial
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
    /* istanbul ignore next */
    return false;
  }

  // Validate first verification digit
  let size = cleanCNPJ.length - 2; // 12 primeiros caracteres
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size); // 2 últimos dígitos verificadores

  // Cálculo do primeiro dígito verificador
  // Pesos 5,4,3,2,9,8,7,6,5,4,3,2 da direita para a esquerda
  let sum = 0;
  let weight = 2;

  // Percorre os dígitos da direita para a esquerda
  for (let i = size - 1; i >= 0; i--) {
    const charValue = hasLetters
      ? getCharValue(numbers.charAt(i))
      : parseInt(numbers.charAt(i));

    sum += charValue * weight;

    // Incrementa o peso, voltando para 2 após chegar a 9
    weight = weight === 9 ? 2 : weight + 1;
  }

  // Cálculo do dígito usando módulo 11
  let remainder = sum % 11;
  let result = remainder < 2 ? 0 : 11 - remainder;

  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  // Validate second verification digit
  size = size + 1; // Inclui o primeiro dígito verificador
  numbers = cleanCNPJ.substring(0, size);

  // Cálculo do segundo dígito verificador
  sum = 0;
  weight = 2;

  // Percorre os dígitos da direita para a esquerda
  for (let i = size - 1; i >= 0; i--) {
    const charValue = hasLetters
      ? getCharValue(numbers.charAt(i))
      : parseInt(numbers.charAt(i));

    sum += charValue * weight;

    // Incrementa o peso, voltando para 2 após chegar a 9
    weight = weight === 9 ? 2 : weight + 1;
  }

  // Cálculo do dígito usando módulo 11
  remainder = sum % 11;
  result = remainder < 2 ? 0 : 11 - remainder;

  return result === parseInt(digits.charAt(1));
}

/**
 * Formats a CNPJ number with the standard mask (XX.XXX.XXX/XXXX-XX)
 * @param cnpj The CNPJ number to format (can be formatted or just numbers/letters)
 * @param maskMode Activates formatting gradually
 * @returns The formatted CNPJ or an empty string if invalid
 */
export function formatCNPJ(cnpj: string, maskMode: boolean = false): string {
  // Check if the CNPJ has letters
  const hasLetters = /[a-zA-Z]/.test(cnpj);

  // Clean the CNPJ appropriately
  const cleanCNPJ = hasLetters ? cleanAlphanumeric(cnpj) : cleanNumbers(cnpj);

  // CNPJ size clean
  const size = cleanCNPJ.length

  // Gradual formatting based on user input
  if (maskMode) {

    // "A" or "A1"
    if (size <= 2) return cleanCNPJ;
    // "A1.B", "A1.B2" or "A1.B2C"
    if (size <= 5) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2)}`;
    // "A1.B2C.3", "A1.B2C.3D", or "A1.B2C.3D4"
    if (size <= 8) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5)}`;
    // "A1.B2C.3D4/E", "A1.B2C.3D4/E5", "A1.B2C.3D4/E5F" or "A1.B2C.3D4/E5F6"
    if (size <= 12) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8, 12)}`;
    // Invalid
    if (size > 14) return '';

  } else if (size !== 14) {
    // Invalid
    return '';
  }

  const pattern = maskMode
    ? /(.{2})(.{3})(.{3})(.{4})(.{1,2})/ // "A1.B2C.3D4/E5F6-6" or "A1.B2C.3D4/E5F6-68"
    : /(.{2})(.{3})(.{3})(.{4})(.{2})/ // Only "A1.B2C.3D4/E5F6-68"

  // Apply the same mask pattern for both numeric and alphanumeric CNPJs
  return cleanCNPJ.replace(pattern, '$1.$2.$3/$4-$5');
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
 * @param maskMode Activates formatting gradually
 * @returns The formatted document or an empty string if invalid
 */
export function formatDocument(document: string, maskMode: boolean = false): string {
  // Check if the document has letters (potential alphanumeric CNPJ)
  const hasLetters = /[a-zA-Z]/.test(document);

  if (hasLetters) {
    // For documents with letters, we only support CNPJ formatting
    const clean = cleanAlphanumeric(document);
    if (clean.length === 14 || maskMode) {
      return formatCNPJ(document, maskMode);
    }
    /* istanbul ignore next */
    return '';
  } else {
    // For numeric documents, we support both CPF and CNPJ
    const clean = cleanNumbers(document);
    if (clean.length === 11 || (clean.length <= 11 && maskMode)) {
      return formatCPF(clean, maskMode);
    } else if (clean.length === 14 || (clean.length <= 14 && maskMode)) {
      return formatCNPJ(clean, maskMode);
    }
    return '';
  }
}
