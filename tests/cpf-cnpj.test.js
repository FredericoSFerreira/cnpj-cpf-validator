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

    // CPF and format correct with mask mode enabled
    const combinations = [
      {value: '8', expected: '8'},
      {value: '853', expected: '853'},
      {value: '8535', expected: '853.5'},
      {value: '853513', expected: '853.513'},
      {value: '8535134', expected: '853.513.4'},
      {value: '853513468', expected: '853.513.468'},
      {value: '8535134689', expected: '853.513.468-9'},
      {value: '85351346893', expected: '853.513.468-93'},
      {value: 'invalidInval', expected: ''},
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

    test('should format CPFs correctly with mask mode disabled', () => {
        expect(formatCPF('52998224725')).toBe('529.982.247-25');
        expect(formatCPF('85351346893')).toBe('853.513.468-93');
        expect(formatCPF('invalid')).toBe('');
    });

    test('should format CPFs correctly with mask mode enabled', () => {
      combinations.forEach((vE) => {
        expect(formatCPF(vE.value, true)).toBe(vE.expected);
      });
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

    // CNPJ numeric and format correct with mask mode enabled
    const combinationsNumeric = [
      {value: '1', expected: '1'},
      {value: '11', expected: '11'},
      {value: '112', expected: '11.2'},
      {value: '11222', expected: '11.222'},
      {value: '112223', expected: '11.222.3'},
      {value: '11222333', expected: '11.222.333'},
      {value: '112223330', expected: '11.222.333/0'},
      {value: '112223330001', expected: '11.222.333/0001'},
      {value: '1122233300018', expected: '11.222.333/0001-8'},
      {value: '11222333000181', expected: '11.222.333/0001-81'},
    ];

    // CNPJ alphanumeric and format correct with mask mode enabled
    const combinationsAlphanumeric = [
      {value: 'A', expected: 'A'},
      {value: 'A1', expected: 'A1'},
      {value: 'A1B', expected: 'A1.B'},
      {value: 'A1B2C', expected: 'A1.B2C'},
      {value: 'A1B2C3', expected: 'A1.B2C.3'},
      {value: 'A1B2C3D4', expected: 'A1.B2C.3D4'},
      {value: 'A1B2C3D4E', expected: 'A1.B2C.3D4/E'},
      {value: 'A1B2C3D4E5F6', expected: 'A1.B2C.3D4/E5F6'},
      {value: 'A1B2C3D4E5F66', expected: 'A1.B2C.3D4/E5F6-6'},
      {value: 'A1B2C3D4E5F668', expected: 'A1.B2C.3D4/E5F6-68'},
      {value: 'invalidInvalidI', expected: ''},
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

    test('should format CNPJs correctly with mask mode disabled', () => {
        expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
        expect(formatCNPJ('A1B2C3D4E5F668')).toBe('A1.B2C.3D4/E5F6-68');
        expect(formatCNPJ('invalid')).toBe('');
    });

    test('should format CNPJs correctly with mask mode enabled', () => {
      // Mask mode enabled - numeric
      combinationsNumeric.forEach((vE) => {
        expect(formatCNPJ(vE.value, true)).toBe(vE.expected);
      });

      // Mask mode enabled - alphanumeric
      combinationsAlphanumeric.forEach((vE) => {
        expect(formatCNPJ(vE.value, true)).toBe(vE.expected);
      });
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

    const combinationsMaskModeDisabled = [
      {value: '52998224725', expected: '529.982.247-25'},
      {value: '11222333000181', expected: '11.222.333/0001-81'},
      {value: 'A1B2C3D4E5F668', expected: 'A1.B2C.3D4/E5F6-68'},
      {value: '12345', expected: ''},
    ];

    const combinationsMaskModeEnabled = [
      {value: '52998224725', expected: '529.982.247-25'},
      {value: '11222333000181', expected: '11.222.333/0001-81'},
      {value: 'A1B2C3D4E5F668', expected: 'A1.B2C.3D4/E5F6-68'},
      {value: '12345', expected: '123.45'},
      {value: '529982', expected: '529.982'},
      {value: '11222333000', expected: '112.223.330-00'},
      {value: '1122233300018', expected: '11.222.333/0001-8'},
      {value: 'A1B2C3D4E5F66', expected: 'A1.B2C.3D4/E5F6-6'},
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

    test('should format documents correctly with mask mode disabled', () => {
      combinationsMaskModeDisabled.forEach((vE) => {
        expect(formatDocument(vE.value)).toBe(vE.expected);
      });
    });

    test('should format documents correctly with mask mode enabled', () => {
      combinationsMaskModeEnabled.forEach((vE) => {
        expect(formatDocument(vE.value, true)).toBe(vE.expected);
      });
    });
});