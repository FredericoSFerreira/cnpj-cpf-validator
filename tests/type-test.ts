import { isValidCPF, formatCPF, isValidCNPJ, formatCNPJ, isValidDocument, formatDocument } from '../src/index';

// Test with string inputs
const cpf: string = '529.982.247-25';
const cnpj: string = '11.222.333/0001-81';
const alphanumericCnpj: string = 'A1.B2C.3D4/E5F6-68';

// Test return types
const isValidCpfResult: boolean = isValidCPF(cpf);
const formattedCpf: string = formatCPF(cpf);

const isValidCnpjResult: boolean = isValidCNPJ(cnpj);
const formattedCnpj: string = formatCNPJ(cnpj);

const isValidAlphanumericCnpjResult: boolean = isValidCNPJ(alphanumericCnpj);
const formattedAlphanumericCnpj: string = formatCNPJ(alphanumericCnpj);

const isValidDocumentResult: boolean = isValidDocument(cpf);
const formattedDocument: string = formatDocument(cnpj);

// Test with incorrect types (these should cause TypeScript errors)
// Uncomment to test type checking
// const invalidTypeTest1 = isValidCPF(123);
// const invalidTypeTest2 = formatCNPJ(true);

console.log('TypeScript type checking passed!');