import { z } from 'zod';

export const CommandType = z.enum(['PUT', 'GET', 'SENDKEY', 'WAIT', 'CLEAR']);

const BaseCommand = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int().positive(),
  type: CommandType,
});

// PUT: Argumento (string/var), Linha (number), Coluna (number). Sem retorno.
export const PutCommand = BaseCommand.extend({
  type: z.literal('PUT'),
  argument: z.string().min(1, "Argumento é obrigatório para PUT"),
  row: z.number().int().positive("Linha é obrigatória e deve ser positiva"),
  col: z.number().int().positive("Coluna é obrigatória e deve ser positiva"),
  returnVar: z.undefined().or(z.literal('')),
});

// GET: Linha, Coluna, Argumento (number - qtd colunas), Retorno (string - var).
export const GetCommand = BaseCommand.extend({
  type: z.literal('GET'),
  argument: z.coerce.number().int().positive("Argumento para GET deve ser a quantidade de colunas (número)"),
  row: z.number().int().positive("Linha é obrigatória"),
  col: z.number().int().positive("Coluna é obrigatória"),
  returnVar: z.string().min(1, "Variável de retorno é obrigatória para GET").refine(val => val.startsWith('@'), "Variável de retorno deve começar com @"),
});

// SENDKEY: Argumento (string). Ignora resto.
export const SendKeyCommand = BaseCommand.extend({
  type: z.literal('SENDKEY'),
  argument: z.string().min(1, "Tecla é obrigatória"),
  row: z.any().optional(),
  col: z.any().optional(),
  returnVar: z.any().optional(),
});

// WAIT: Argumento (number - ms). Ignora resto.
export const WaitCommand = BaseCommand.extend({
  type: z.literal('WAIT'),
  argument: z.coerce.number().int().nonnegative("Tempo em ms deve ser positivo"),
  row: z.any().optional(),
  col: z.any().optional(),
  returnVar: z.any().optional(),
});

// CLEAR: Sem args.
export const ClearCommand = BaseCommand.extend({
  type: z.literal('CLEAR'),
  argument: z.any().optional(),
  row: z.any().optional(),
  col: z.any().optional(),
  returnVar: z.any().optional(),
});

export const RpaStepSchema = z.discriminatedUnion('type', [
  PutCommand,
  GetCommand,
  SendKeyCommand,
  WaitCommand,
  ClearCommand,
]);

export const RpaScriptSchema = z.object({
  name: z.string().min(1, "Nome do script é obrigatório"),
  inputVars: z.array(z.string().startsWith('@')).optional(),
  steps: z.array(RpaStepSchema)
    .refine((steps) => {
      // Validar ordem crescente
      for (let i = 0; i < steps.length - 1; i++) {
        if (steps[i].order >= steps[i + 1].order) return false;
      }
      return true;
    }, "Os passos devem estar em ordem crescente")
    .refine((steps) => {
      // Validar finalização com CLEAR + WAIT
      if (steps.length < 2) return false;
      const last = steps[steps.length - 1];
      const penult = steps[steps.length - 2];
      return penult.type === 'CLEAR' && last.type === 'WAIT';
    }, "O script deve terminar obrigatoriamente com CLEAR seguido de WAIT"),
});

export type RpaStep = z.infer<typeof RpaStepSchema>;
export type RpaScript = z.infer<typeof RpaScriptSchema>;
