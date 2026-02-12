# Documento de Arquitetura Técnica - Gerador de RPAs

## 1. Visão Geral

O sistema é uma aplicação web que permite a usuários leigos criar scripts de RPA (Robotic Process Automation) através de uma interface visual, gerando um arquivo CSV formatado e validado para importação no Microsoft Dynamics.

## 2. Stack Tecnológica

### 2.1 Backend

* **Runtime**: Node.js (LTS)

* **Linguagem**: TypeScript

* **Framework**: Express.js

* **Validação**: Zod (para validação de schema e regras de negócio)

* **Geração de Arquivos**: csv-writer (ou implementação customizada para CSV)

* **Arquitetura**: MVC ou Camadas (Controller, Service, Domain/Model)

### 2.2 Frontend

* **Framework**: React (Vite)

* **Linguagem**: TypeScript

* **Estilização**: Tailwind CSS

* **Componentes**: Shadcn/UI (baseado em Radix UI)

* **Gerenciamento de Estado**: Zustand (para gerenciar o estado do script RPA em construção)

* **Ícones**: Lucide React

## 3. Arquitetura de Dados

### 3.1 DSL Interna (JSON)

O estado da aplicação será mantido em uma estrutura JSON (DSL) antes da conversão para CSV.

```typescript
type CommandType = 'PUT' | 'GET' | 'SENDKEY' | 'WAIT' | 'CLEAR';

interface RPACommand {
  id: string; // Identificador único interno
  order: number; // Coluna 'Ordem'
  type: CommandType; // Coluna 'Comando'
  line?: number; // Coluna 'Linha'
  column?: number; // Coluna 'Coluna'
  argument?: string; // Coluna 'Argumento'
  returnVar?: string; // Coluna 'Retorno'
}

interface RPAScript {
  name: string; // Coluna 'Script'
  inputVariables: string[];
  commands: RPACommand[];
}
```

### 3.2 Estrutura do CSV de Saída

O CSV gerado seguirá estritamente as colunas:
`Script`, `Argumento`, `Coluna`, `Linha`, `Comando`, `Ordem`, `Retorno`

## 4. Fluxo da Aplicação

1. **Definição Inicial**: Usuário define nome do script e variáveis de entrada.
2. **Construção do Fluxo**: Usuário adiciona comandos sequencialmente via UI.

   * O sistema valida regras imediatas (campos obrigatórios por tipo).

   * O sistema sugere/insere `WAIT` automaticamente.

   * O sistema gerencia a numeração `Ordem` (incrementos de 10).
3. **Validação**: Antes de exportar, o backend (ou validação compartilhada) verifica:

   * Integridade das variáveis (uso vs definição).

   * Presença de `CLEAR` + `WAIT` no final.

   * Sequência lógica.
4. **Geração**: O backend converte a DSL JSON validada para o formato CSV do Dynamics.

## 5. Regras de Negócio (Core)

* **PUT**: Requer Argumento, Linha, Coluna.

* **GET**: Requer Linha, Coluna, Argumento (qtd colunas), Retorno.

* **SENDKEY/WAIT**: Requer Argumento.

* **CLEAR**: Sem parâmetros.

* **Ordem**: Crescente, múltiplos de 10.

* **Finalização**: Todo script deve terminar com CLEAR seguido de WAIT.

## 6. Estrutura de Diretórios (Sugestão)

```
/
├── src/ (Frontend)
│   ├── components/ (UI e Blocos de RPA)
│   ├── hooks/ (Lógica de estado e validação)
│   ├── store/ (Zustand - Estado do Script)
│   ├── types/ (Definições TS compartilhadas)
│   └── App.tsx
├── api/ (Backend)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/ (Gerador CSV, Validador)
│   │   ├── schemas/ (Zod Schemas)
│   │   └── index.ts
└── ...
```

