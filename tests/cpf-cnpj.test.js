// Jest tests for cnpj-cpf-validator

// Import the library
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
describe('CPF Functions', () => {
  // Valid CPF examples
  const validCPFs = [
    '529.982.247-25',
    '52998224725',
    '853.513.468-93'
  ];

  // Invalid CPF examples
  const invalidCPFs = [
    '111.111.111-11', // All same digits
    '123.456.789-10', // Invalid check digits
    '12345678901234', // Too long
    '1234567890'      // Too short
  ];

  test('should validate valid CPFs correctly', () => {
    validCPFs.forEach(cpf => {
      expect(isValidCPF(cpf)).toBe(true);
    });
  });

  test('should reject invalid CPFs', () => {
    invalidCPFs.forEach(cpf => {
      expect(isValidCPF(cpf)).toBe(false);
    });
  });

  test('should format CPFs correctly', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25');
    expect(formatCPF('85351346893')).toBe('853.513.468-93');
    expect(formatCPF('invalid')).toBe('');
  });

  test('should clean CPFs correctly', () => {
    expect(cleanCPF('529.982.247-25')).toBe('52998224725');
    expect(cleanCPF('529-982-247.25')).toBe('52998224725');
  });
});

// Test CNPJ functions
describe('CNPJ Functions', () => {
  // Valid numeric CNPJ examples
  const validNumericCNPJs = [
    '11.222.333/0001-81',
    '11222333000181',
    '45.283.163/0001-67'
  ];

  // Invalid numeric CNPJ examples
  const invalidNumericCNPJs = [
    '11.111.111/1111-11', // All same digits
    '12.345.678/9012-34', // Invalid check digits
    '1234567890',         // Too short
    '123456789012345'     // Too long
  ];

  // Valid alphanumeric CNPJ examples
  const validAlphanumericCNPJs = [
    'A1.B2C.3D4/E5F6-68',
    'A1B2C3D4E5F668',
    'XY.ZWA.BCD/EFGH-26',
    'PQ.R0S.TU1/VWX2-62'
  ];

  // Invalid alphanumeric CNPJ examples
  const invalidAlphanumericCNPJs = [
    'A1B2.C3D4.E5F6/G7H8-AB', // Non-numeric check digits
    'A1B2C3D4E5F6G7H8',       // Too short
    'A1B2C3D4E5F6G7H8901234'  // Too long
  ];

  test('should validate valid numeric CNPJs correctly', () => {
    validNumericCNPJs.forEach(cnpj => {
      expect(isValidCNPJ(cnpj)).toBe(true);
    });
  });

  test('should reject invalid numeric CNPJs', () => {
    invalidNumericCNPJs.forEach(cnpj => {
      expect(isValidCNPJ(cnpj)).toBe(false);
    });
  });

  test('should validate valid alphanumeric CNPJs correctly', () => {
    validAlphanumericCNPJs.forEach(cnpj => {
      expect(isValidCNPJ(cnpj)).toBe(true);
    });
  });

  test('should reject invalid alphanumeric CNPJs', () => {
    invalidAlphanumericCNPJs.forEach(cnpj => {
      expect(isValidCNPJ(cnpj)).toBe(false);
    });
  });

  test('should format CNPJs correctly', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatCNPJ('A1B2C3D4E5F668')).toBe('A1.B2C.3D4/E5F6-68');
    expect(formatCNPJ('invalid')).toBe('');
  });

  test('should clean CNPJs correctly', () => {
    expect(cleanCNPJ('11.222.333/0001-81')).toBe('11222333000181');
    expect(cleanCNPJ('A1.B2C.3D4/E5F6-68')).toBe('A1B2C3D4E5F668');
  });
});

// Test combined functions
describe('Combined Functions', () => {
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

  test('should validate documents correctly', () => {
    expect(isValidDocument('529.982.247-25')).toBe(true);
    expect(isValidDocument('111.111.111-11')).toBe(false);
    expect(isValidDocument('11.222.333/0001-81')).toBe(true);
    expect(isValidDocument('11.111.111/1111-11')).toBe(false);
    expect(isValidDocument('A1.B2C.3D4/E5F6-68')).toBe(true);
    expect(isValidDocument('A1B2.C3D4.E5F6/G7H8-AB')).toBe(false);
    expect(isValidDocument('12345')).toBe(false);
  });

  test('should format documents correctly', () => {
    expect(formatDocument('52998224725')).toBe('529.982.247-25');
    expect(formatDocument('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatDocument('A1B2C3D4E5F668')).toBe('A1.B2C.3D4/E5F6-68');
    expect(formatDocument('12345')).toBe('');
  });
});