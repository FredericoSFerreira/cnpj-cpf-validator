// Simple test script for cnpj-cpf-validator

// Import the library
// Note: In a real project, you would use require('cnpj-cpf-validator')
// but for local testing, we'll use the relative path
const {
  isValidCPF,
  formatCPF,
  cleanCPF,
  isValidCNPJ,
  formatCNPJ,
  cleanCNPJ,
  isValidDocument,
  formatDocument
} = require('../dist/index.js');

// Test CPF functions
console.log('=== Testing CPF functions ===');

// Valid CPF examples
const validCPFs = [
  '529.982.247-25',
  '52998224725',
  '853.513.468-93'
];

validCPFs.forEach(cpf => {
  console.log(`CPF ${cpf} is valid:`, isValidCPF(cpf));
  console.log(`CPF ${cpf} formatted:`, formatCPF(cpf));
  console.log(`CPF ${cpf} cleaned:`, cleanCPF(cpf));
  console.log('---');
});

// Invalid CPF examples
const invalidCPFs = [
  '111.111.111-11', // All same digits
  '123.456.789-10', // Invalid check digits
  '12345678901234', // Too long
  '1234567890'      // Too short
];

invalidCPFs.forEach(cpf => {
  console.log(`CPF ${cpf} is valid:`, isValidCPF(cpf));
  console.log('---');
});

// Test CNPJ functions
console.log('\n=== Testing CNPJ functions ===');

// Valid numeric CNPJ examples
console.log('\n--- Testing numeric CNPJs ---');
const validNumericCNPJs = [
  '11.222.333/0001-81',
  '11222333000181',
  '45.283.163/0001-67'
];

validNumericCNPJs.forEach(cnpj => {
  console.log(`CNPJ ${cnpj} is valid:`, isValidCNPJ(cnpj));
  console.log(`CNPJ ${cnpj} formatted:`, formatCNPJ(cnpj));
  console.log(`CNPJ ${cnpj} cleaned:`, cleanCNPJ(cnpj));
  console.log('---');
});

// Invalid numeric CNPJ examples
const invalidNumericCNPJs = [
  '11.111.111/1111-11', // All same digits
  '12.345.678/9012-34', // Invalid check digits
  '1234567890',         // Too short
  '123456789012345'     // Too long
];

invalidNumericCNPJs.forEach(cnpj => {
  console.log(`CNPJ ${cnpj} is valid:`, isValidCNPJ(cnpj));
  console.log('---');
});

// Test alphanumeric CNPJ functions (new format)
console.log('\n--- Testing alphanumeric CNPJs (new format) ---');

// These are example alphanumeric CNPJs with valid check digits
// Generated using the verification digit calculation algorithm
const validAlphanumericCNPJs = [
  'A1.B2C.3D4/E5F6-68',
  'A1B2C3D4E5F668',
  'XY.ZWA.BCD/EFGH-26',
  'PQ.R0S.TU1/VWX2-62'
];

validAlphanumericCNPJs.forEach(cnpj => {
  console.log(`Alphanumeric CNPJ ${cnpj} is valid:`, isValidCNPJ(cnpj));
  console.log(`Alphanumeric CNPJ ${cnpj} formatted:`, formatCNPJ(cnpj));
  console.log(`Alphanumeric CNPJ ${cnpj} cleaned:`, cleanCNPJ(cnpj));
  console.log('---');
});

// Invalid alphanumeric CNPJ examples
const invalidAlphanumericCNPJs = [
  'A1B2.C3D4.E5F6/G7H8-AB', // Non-numeric check digits
  'A1B2C3D4E5F6G7H8',       // Too short
  'A1B2C3D4E5F6G7H8901234'  // Too long
];

invalidAlphanumericCNPJs.forEach(cnpj => {
  console.log(`Alphanumeric CNPJ ${cnpj} is valid:`, isValidCNPJ(cnpj));
  console.log('---');
});

// Test combined functions
console.log('\n=== Testing combined functions ===');

const documents = [
  '529.982.247-25',     // Valid CPF
  '111.111.111-11',     // Invalid CPF
  '11.222.333/0001-81', // Valid numeric CNPJ
  '11.111.111/1111-11', // Invalid numeric CNPJ
  'A1.B2C.3D4/E5F6-68', // Valid alphanumeric CNPJ
  'XY.ZWA.BCD/EFGH-26', // Valid alphanumeric CNPJ
  'A1B2.C3D4.E5F6/G7H8-AB', // Invalid alphanumeric CNPJ (non-numeric check digits)
  '12345',              // Invalid (too short)
];

documents.forEach(doc => {
  console.log(`Document ${doc} is valid:`, isValidDocument(doc));
  console.log(`Document ${doc} formatted:`, formatDocument(doc));
  console.log('---');
});

console.log('All tests completed!');
