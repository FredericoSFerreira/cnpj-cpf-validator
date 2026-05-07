// Jest tests for cnpj-cpf-validator (TypeScript version)

// Import the library
import {
    isValidCPF,
    formatCPF,
    cleanCPF,
    isValidCNPJ,
    formatCNPJ,
    cleanCNPJ,
    isValidDocument,
    isAlphanumericCNPJ,
    formatDocument,
    cleanNumbers,
    cleanAlphanumeric
} from '../src/index';

// Type to help with validation
type ValueAndExpected = {
  value: string,
  expected: string
}

// Test CPF functions
describe('CPF Functions', () => {
    // Valid CPF examples
    const validCPFs: string[] = [
        '529.982.247-25',
        '52998224725',
        '853.513.468-93'
    ];

    // Invalid CPF examples
    const invalidCPFs: string[] = [
        '111.111.111-11', // All same digits
        '123.456.789-10', // Invalid check digits
        '12345678901234', // Too long
        '1234567890'      // Too short
    ];

    // CPF and format correct with mask mode enabled
    const combinations: ValueAndExpected[] = [
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
        combinations.forEach((vE: ValueAndExpected): void => {
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
    const validNumericCNPJs: string[] = [
        '11.222.333/0001-81',
        '11222333000181',
        '45.283.163/0001-67'
    ];

    // Invalid numeric CNPJ examples
    const invalidNumericCNPJs: string[] = [
        '11.111.111/1111-11', // All same digits
        '12.345.678/9012-34', // Invalid check digits
        '1234567890',         // Too short
        '123456789012345'     // Too long
    ];

    // Valid alphanumeric CNPJ examples
    const validAlphanumericCNPJs: string[] = [
        'A1.B2C.3D4/E5F6-68',
        'A1B2C3D4E5F668',
        'XY.ZWA.BCD/EFGH-26',
        'PQ.R0S.TU1/VWX2-62'
    ];

    // Invalid alphanumeric CNPJ examples
    const invalidAlphanumericCNPJs: string[] = [
        'A1B2.C3D4.E5F6/G7H8-AB', // Non-numeric check digits
        'A1B2C3D4E5F6G7H8',       // Too short
        'A1B2C3D4E5F6G7H8901234',  // Too long,
        'PQ.R0S.TU1/VWX2-61' // incorrect digit verification
    ];

    // CNPJ numeric and format correct with mask mode enabled
    const combinationsNumeric: ValueAndExpected[] = [
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
    const combinationsAlphanumeric: ValueAndExpected[] = [
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
        combinationsNumeric.forEach((vE: ValueAndExpected): void => {
          expect(formatCNPJ(vE.value, true)).toBe(vE.expected);
        });

        // Mask mode enabled - alphanumeric
        combinationsAlphanumeric.forEach((vE: ValueAndExpected): void => {
          expect(formatCNPJ(vE.value, true)).toBe(vE.expected);
        });
    });

    test('should clean CNPJs correctly', () => {
        expect(cleanCNPJ('11.222.333/0001-81')).toBe('11222333000181');
        expect(cleanCNPJ('A1.B2C.3D4/E5F6-68')).toBe('A1B2C3D4E5F668');
    });

    test('should validate CNPJs is alphanumeric', () => {
        validAlphanumericCNPJs.forEach(cnpj => {
            expect(isAlphanumericCNPJ(cnpj)).toBe(true);
        });

        validNumericCNPJs.forEach(cnpj => {
            expect(isAlphanumericCNPJ(cnpj)).toBe(false);
        });

    });

});

// Test combined functions
describe('Combined Functions', () => {
    const documents: string[] = [
        '529.982.247-25',     // Valid CPF
        '111.111.111-11',     // Invalid CPF
        '11.222.333/0001-81', // Valid numeric CNPJ
        '11.111.111/1111-11', // Invalid numeric CNPJ
        'A1.B2C.3D4/E5F6-68', // Valid alphanumeric CNPJ
        'XY.ZWA.BCD/EFGH-26', // Valid alphanumeric CNPJ
        'A1B2.C3D4.E5F6/G7H8-AB', // Invalid alphanumeric CNPJ (non-numeric check digits)
        '12345',              // Invalid (too short)
    ];

    const combinationsMaskModeDisabled: ValueAndExpected[] = [
        {value: '52998224725', expected: '529.982.247-25'},
        {value: '11222333000181', expected: '11.222.333/0001-81'},
        {value: 'A1B2C3D4E5F668', expected: 'A1.B2C.3D4/E5F6-68'},
        {value: '12345', expected: ''},
    ];

    const combinationsMaskModeEnabled: ValueAndExpected[] = [
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
        combinationsMaskModeDisabled.forEach((vE: ValueAndExpected): void => {
          expect(formatDocument(vE.value)).toBe(vE.expected);
        });
    });

    test('should format documents correctly with mask mode enabled', () => {
        combinationsMaskModeEnabled.forEach((vE: ValueAndExpected): void => {
          expect(formatDocument(vE.value, true)).toBe(vE.expected);
        });
    });
});

// Test utility functions
describe('Utility Functions', () => {
    test('should clean numbers correctly', () => {
        expect(cleanNumbers('123-456.789')).toBe('123456789');
        expect(cleanNumbers('abc123def456')).toBe('123456');
        expect(cleanNumbers('!@#$%^&*()')).toBe('');
    });

    test('should clean alphanumeric characters correctly', () => {
        expect(cleanAlphanumeric('abc-123.def_456')).toBe('abc123def456');
        expect(cleanAlphanumeric('!@#ABC123def$%^')).toBe('ABC123def');
        expect(cleanAlphanumeric('!@#$%^&*()')).toBe('');
    });
});

// Test TypeScript type checking
describe('TypeScript Type Checking', () => {
    test('functions should accept string inputs', () => {
        // These tests don't actually assert anything at runtime
        // They just verify that TypeScript accepts these calls
        const cpf: string = '529.982.247-25';
        const cnpj: string = '11.222.333/0001-81';
        const alphanumericCnpj: string = 'A1.B2C.3D4/E5F6-68';

        // Test return types
        const isValidCpfResult: boolean = isValidCPF(cpf);
        const formattedCpf: string = formatCPF(cpf);
        const formattedCpfMaskMode: string = formatCPF(cpf, true);

        const isValidCnpjResult: boolean = isValidCNPJ(cnpj);
        const formattedCnpj: string = formatCNPJ(cnpj);
        const formattedCnpjMaskMode: string = formatCNPJ(cnpj, true);

        const isValidAlphanumericCnpjResult: boolean = isValidCNPJ(alphanumericCnpj);
        const formattedAlphanumericCnpj: string = formatCNPJ(alphanumericCnpj);
        const formattedAlphanumericCnpjMaskMode: string = formatCNPJ(alphanumericCnpj, true);

        const isValidDocumentResult: boolean = isValidDocument(cpf);
        const formattedDocument: string = formatDocument(cnpj);
        const formattedDocumentMaskMode: string = formatDocument(cnpj, true);

        // Just to avoid unused variable warnings
        expect(typeof isValidCpfResult).toBe('boolean');
        expect(typeof formattedCpf).toBe('string');
        expect(typeof formattedCpfMaskMode).toBe('string');
        expect(typeof isValidCnpjResult).toBe('boolean');
        expect(typeof formattedCnpj).toBe('string');
        expect(typeof formattedCnpjMaskMode).toBe('string');
        expect(typeof isValidAlphanumericCnpjResult).toBe('boolean');
        expect(typeof formattedAlphanumericCnpj).toBe('string');
        expect(typeof formattedAlphanumericCnpjMaskMode).toBe('string');
        expect(typeof isValidDocumentResult).toBe('boolean');
        expect(typeof formattedDocument).toBe('string');
        expect(typeof formattedDocumentMaskMode).toBe('string');
    });
});

describe('CNPJ Digit Verification Calculation Tests', () => {

  test('should validate an alphanumeric CNPJ with manually calculated verification digits', () => {
    expect(isValidCNPJ('ABCDEFGHIJKL80')).toBe(true);
  });

  test('should validate specific alphanumeric CNPJs with known verification digits', () => {
    expect(isValidCNPJ('A1B2C3D4E5F668')).toBe(true);
    expect(isValidCNPJ('XYZWABCDEFGH26')).toBe(true);
    expect(isValidCNPJ('PQR0STU1VWX262')).toBe(true); // Este deve falhar se os dígitos não foram calculados corretamente
  });

  test('should reject alphanumeric CNPJs with incorrect verification digits', () => {
    expect(isValidCNPJ('ABCDEFGHIJKL99')).toBe(false); // Dígitos verificadores incorretos
    expect(isValidCNPJ('A1B2C3D4E5F667')).toBe(false); // Segundo dígito incorreto
    expect(isValidCNPJ('XYZWABCDEFGH25')).toBe(false); // Segundo dígito incorreto
  });
});
