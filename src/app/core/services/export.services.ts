import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver-es';

export interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  /**
   * Export data to Excel file with title and total count
   * @param data - Array of objects to export
   * @param options - Export configuration options
   */
  exportToExcel(data: any[], options: ExportOptions = {}): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const {
      fileName = `export_${new Date().getTime()}`,
      sheetName = 'Sheet1',
      title = 'The Unity Ware Excel Report',
    } = options;

    try {
      const ws: XLSX.WorkSheet = {};
      const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };

      const headers = Object.keys(data[0]);
      const numCols = headers.length;

      ws['A1'] = {
        v: title,
        t: 's',
        s: {
          font: { bold: true, sz: 16, color: { rgb: '1F4E78' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        },
      };

      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }];
      const headerRow = 2;
      headers.forEach((header, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: colIdx });
        ws[cellRef] = {
          v: header,
          t: 's',
          s: {
            font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4472C4' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        };
      });

      data.forEach((row, rowIdx) => {
        headers.forEach((header, colIdx) => {
          const cellRef = XLSX.utils.encode_cell({
            r: headerRow + 1 + rowIdx,
            c: colIdx,
          });

          const value = row[header];
          ws[cellRef] = {
            v: value ?? '',
            t: typeof value === 'number' ? 'n' : 's',
            s: {
              font: { sz: 10 },
              alignment: { horizontal: 'left', vertical: 'center' },
              border: {
                top: { style: 'thin', color: { rgb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
                left: { style: 'thin', color: { rgb: 'D9D9D9' } },
                right: { style: 'thin', color: { rgb: 'D9D9D9' } },
              },
            },
          };
        });
      });

      const totalRow = headerRow + data.length + 1;

      const emptyRowBeforeTotal = totalRow;

      const totalCountRow = emptyRowBeforeTotal + 1;

      ws[XLSX.utils.encode_cell({ r: totalCountRow, c: 0 })] = {
        v: 'Total Records:',
        t: 's',
        s: {
          font: { bold: true, sz: 11 },
          alignment: { horizontal: 'right', vertical: 'center' },
        },
      };

      ws[XLSX.utils.encode_cell({ r: totalCountRow, c: 1 })] = {
        v: data.length,
        t: 'n',
        s: {
          font: { bold: true, sz: 11, color: { rgb: '1F4E78' } },
          alignment: { horizontal: 'left', vertical: 'center' },
        },
      };

      range.e.c = numCols - 1;
      range.e.r = totalCountRow;
      ws['!ref'] = XLSX.utils.encode_range(range);

      const colWidths = headers.map((header) => {
        const maxLength = Math.max(
          header.length,
          ...data.map((row) => {
            const value = row[header];
            return value ? String(value).length : 0;
          })
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });

      ws['!cols'] = colWidths;

      ws['!rows'] = [
        { hpx: 30 },
        { hpx: 10 },
        { hpx: 22 },
        ...Array(data.length).fill({ hpx: 18 }), // Data rows
        { hpx: 10 },
        { hpx: 22 },
      ];

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const excelBuffer: any = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Save file using file-saver
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel Export Error:', error);
      throw new Error('Failed to export Excel file');
    }
  }

  /**
   * Export data to CSV file
   * @param data - Array of objects to export
   * @param options - Export configuration options
   */
  exportToCSV(data: any[], options: ExportOptions = {}): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const { fileName = `export_${new Date().getTime()}` } = options;

    try {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      const csv = XLSX.utils.sheet_to_csv(ws);

      const blob = new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8;',
      });
      saveAs(blob, `${fileName}.csv`);
    } catch (error) {
      console.error('CSV Export Error:', error);
      throw new Error('Failed to export CSV file');
    }
  }
}
