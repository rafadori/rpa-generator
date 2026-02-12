import { Request, Response } from 'express';
import { RpaScriptSchema } from '../schemas/rpa.schema';
import { CsvService } from '../services/csv.service';
import { z, ZodError } from 'zod';

const csvService = new CsvService();

export class RpaController {
  async generate(req: Request, res: Response) {
    try {
      // 1. Validar o payload
      const script = RpaScriptSchema.parse(req.body);

      // 2. Gerar o CSV
      const csv = await csvService.generateCsv(script);

      // 3. Retornar o arquivo
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="${script.name}.csv"`);
      res.send(csv);

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Erro de validação',
          errors: (error as any).errors,
        });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Erro interno ao gerar CSV' });
      }
    }
  }

  async validate(req: Request, res: Response) {
    try {
      RpaScriptSchema.parse(req.body);
      res.json({ valid: true });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          valid: false,
          errors: (error as any).errors,
        });
      } else {
        res.status(500).json({ message: 'Erro interno de validação' });
      }
    }
  }
}
