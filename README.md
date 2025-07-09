# Validador de CNPJ/CPF 
[![codecov](https://codecov.io/gh/FredericoSFerreira/cnpj-cpf-validator/branch/main/graph/badge.svg?token=MBIO51G1JR)](https://codecov.io/gh/FredericoSFerreira/cnpj-cpf-validator) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=flat) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)


Uma biblioteca TypeScript/JavaScript/Node para validar e formatar números de CPF e CNPJ já com o suporte aos novos CNPJ alfanuméricos.

## Instalação

```bash
npm install cnpj-cpf-validator
# ou
yarn add cnpj-cpf-validator
# ou
pnpm add cnpj-cpf-validator
```

## Funcionalidades

- Validação de números de CPF e CNPJ
- Formatação de números de CPF e CNPJ com máscaras padrão
- Limpeza de números de CPF e CNPJ (remoção de caracteres não numéricos)
- Suporte a TypeScript com definições de tipos
- Zero dependências
- Funciona em Node.js e navegadores
- Suporta tanto CommonJS quanto ES Modules
- **Suporte ao novo formato alfanumérico de CNPJ** (a partir de julho de 2026)

## Novo formato de CNPJ alfanumérico (a partir de julho de 2026)

A Receita Federal do Brasil anunciou mudanças no formato do CNPJ que começarão a valer a partir de julho de 2026. A principal alteração é a introdução do CNPJ alfanumérico, que incluirá letras, além dos números, na sua composição.

### Como funcionará o novo CNPJ:

- **Formato Alfanumérico**: O CNPJ continuará tendo 14 caracteres, mas:
  - As oito primeiras posições, que formam a raiz do CNPJ (identificação da empresa), poderão conter tanto letras quanto números.
  - As quatro posições seguintes, que indicam a ordem do estabelecimento (matriz ou filial), também serão alfanuméricas.
  - As duas últimas posições, que são os dígitos verificadores (utilizados para validar a autenticidade do CNPJ), continuarão sendo exclusivamente numéricas.

- **Convivência de formatos**: Os CNPJs já existentes (apenas numéricos) permanecerão válidos. O novo formato alfanumérico será implementado apenas para novas inscrições a partir de julho de 2026. Os dois formatos (numérico e alfanumérico) vão coexistir.

### Exemplos de CNPJs alfanuméricos:

- `A1B2.C3D4.E5F6/G7H8-01`
- `ZX98.WV76.UT54/SR32-99`
- `12AB.34CD.56EF/78GH-10`
- `XYZW.ABCD.EFGH/IJKL-23`
- `PQR0.STU1.VWX2/YZA3-45`

**Esta biblioteca já suporta a validação e formatação de CNPJs alfanuméricos!**

## Uso

### JavaScript (CommonJS)

```javascript
const { isValidCPF, formatCPF, isValidCNPJ, formatCNPJ } = require('cnpj-cpf-validator');
```

### JavaScript (ES Modules)

```javascript
import { isValidCPF, formatCPF, isValidCNPJ, formatCNPJ } from 'cnpj-cpf-validator';
```

### Exemplos de uso (ES Modules)

```javascript
// Validação de CPF
console.log(isValidCPF('529.982.247-25')); // true
console.log(isValidCPF('52998224725')); // true
console.log(isValidCPF('111.111.111-11')); // false (CPF inválido)

// Formatação de CPF
console.log(formatCPF('52998224725')); // '529.982.247-25'

// Validação de CNPJ (formato numérico tradicional)
console.log(isValidCNPJ('11.222.333/0001-81')); // true
console.log(isValidCNPJ('11222333000181')); // true
console.log(isValidCNPJ('11.111.111/1111-11')); // false (CNPJ inválido)

// Formatação de CNPJ (formato numérico tradicional)
console.log(formatCNPJ('11222333000181')); // '11.222.333/0001-81'

// Validação de CNPJ (novo formato alfanumérico)
console.log(isValidCNPJ('A1B2.C3D4.E5F6/G7H8-01')); // true
console.log(isValidCNPJ('A1B2C3D4E5F6G7H801')); // true

// Formatação de CNPJ (novo formato alfanumérico)
console.log(formatCNPJ('A1B2C3D4E5F6G7H801')); // 'A1.B2C.3D4/E5F6-01'
```

## API

### Funções para CPF

#### `isValidCPF(cpf: string): boolean`

Valida se um número de CPF é válido.

- **cpf**: O número de CPF a ser validado (pode estar formatado ou conter apenas números)
- **Retorna**: True se o CPF for válido, false caso contrário

#### `formatCPF(cpf: string): string`

Formata um número de CPF com a máscara padrão (XXX.XXX.XXX-XX).

- **cpf**: O número de CPF a ser formatado (pode estar formatado ou conter apenas números)
- **Retorna**: O CPF formatado ou uma string vazia se for inválido

#### `cleanCPF(cpf: string): string`

Remove quaisquer caracteres não numéricos de um CPF.

- **cpf**: O CPF a ser limpo
- **Retorna**: Uma string contendo apenas os números do CPF

### Funções para CNPJ

#### `isValidCNPJ(cnpj: string): boolean`

Valida se um número de CNPJ é válido (suporta tanto o formato numérico tradicional quanto o novo formato alfanumérico).

- **cnpj**: O número de CNPJ a ser validado (pode estar formatado ou conter apenas números/letras)
- **Retorna**: True se o CNPJ for válido, false caso contrário

#### `formatCNPJ(cnpj: string): string`

Formata um número de CNPJ com a máscara padrão (XX.XXX.XXX/XXXX-XX).

- **cnpj**: O número de CNPJ a ser formatado (pode estar formatado ou conter apenas números/letras)
- **Retorna**: O CNPJ formatado ou uma string vazia se for inválido

#### `cleanCNPJ(cnpj: string): string`

Remove caracteres de formatação de um CNPJ.
- Para CNPJs numéricos: remove todos os caracteres não numéricos
- Para CNPJs alfanuméricos: remove todos os caracteres não alfanuméricos

- **cnpj**: O CNPJ a ser limpo
- **Retorna**: Uma string contendo apenas os caracteres alfanuméricos do CNPJ

### Funções Combinadas

#### `isValidDocument(document: string): boolean`

Valida se um número de documento é um CPF ou CNPJ válido.

- **document**: O número do documento a ser validado (pode estar formatado ou conter apenas números/letras)
- **Retorna**: True se o documento for um CPF ou CNPJ válido, false caso contrário

#### `formatDocument(document: string): string`

Formata um número de documento como CPF ou CNPJ com base em suas características.

- **document**: O número do documento a ser formatado (pode estar formatado ou conter apenas números/letras)
- **Retorna**: O documento formatado ou uma string vazia se for inválido

### Funções Utilitárias

#### `cleanNumbers(value: string): string`

Remove todos os caracteres não numéricos de uma string.

- **value**: A string a ser limpa
- **Retorna**: Uma string contendo apenas números

#### `cleanAlphanumeric(value: string): string`

Remove todos os caracteres não alfanuméricos de uma string.

- **value**: A string a ser limpa
- **Retorna**: Uma string contendo apenas letras e números

## Testes

Para executar os testes:

```bash
npm test
```

Para executar os testes com cobertura:

```bash
npm run test:coverage
```


## Licença

MIT
