import React from 'react';
import ExcelJS from 'exceljs';

const ExportToExcelButton = ({ data = [{}], fileName='datos' }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Mapeo de nombres de las columnas que quieres incluir
    const columnMapping = {
      frecuenciaHex: 'BandaHex',
      frecuencia: 'Banda',
      frecCh1Low: 'CH1Low',
      frecCh1High: 'CH1High',
      frecCh2Low: 'CH2Low',
      frecCh2High: 'CH2High',
      frecCh3Low: 'CH3Low',
      frecCh3High: 'CH3High', // Corregido ya que antes se repetía con 'CH4High'
      frecCh4Low: 'CH4Low',
      frecCh4High: 'CH4High',
      potencia: 'Potencia',
      estadoSW: 'Estado',
    };

    // Filtrar las claves que deseas exportar
    const selectedKeys = Object.keys(columnMapping);

    // Agregar encabezados personalizados
    const headers = selectedKeys.map(key => columnMapping[key]);
    worksheet.addRow(headers);

    // Agregar datos, filtrando solo las columnas deseadas
    data.forEach((row) => {
      const filteredRowData = selectedKeys.map(key => row[key]);
      worksheet.addRow(filteredRowData);
    });

    // Escribir archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button type='button' className='btn btn-sm btn-primary' onClick={exportToExcel}>
      Exportar Excel
    </button>
  );
};

export default ExportToExcelButton;
