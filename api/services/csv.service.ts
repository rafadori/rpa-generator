import { createObjectCsvStringifier } from 'csv-writer';
import { RpaScript } from '../schemas/rpa.schema';

export class CsvService {
  async generateCsv(script: RpaScript): Promise<string> {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'script', title: 'Script' },
        { id: 'argument', title: 'Argumento' },
        { id: 'col', title: 'Coluna' },
        { id: 'row', title: 'Linha' },
        { id: 'command', title: 'Comando' },
        { id: 'order', title: 'Ordem' },
        { id: 'returnVar', title: 'Retorno' },
      ],
    });

    const records = script.steps.map((step) => ({
      script: script.name,
      argument: step.argument ?? '',
      col: step.col ?? '',
      row: step.row ?? '',
      command: step.type,
      order: step.order,
      returnVar: step.returnVar ?? '',
    }));

    const header = csvStringifier.getHeaderString();
    const recordsString = csvStringifier.stringifyRecords(records);

    return header + recordsString;
  }
}
