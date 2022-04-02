import * as React from "react";
import { Cell, Row, useTable } from 'react-table';
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { 
  TableDataType,
  TableRows,
  TableRow 
} from "cdm/FolderModel";
import {makeData } from 'mock/mockUtils';
import CellView from 'components/CellView';

const borderStyle = {
  border: "1px solid gray",
  padding: "8px 10px"
};

function renderRow(row:Row) { 
  return (
    <tr {...row.getRowProps()}>
        {row.cells.map(
          (cell:CellView) => renderCell(cell)
          )
        }
    </tr>
  )
}

function renderCell(cell:CellView) {
  console.log(cell);
  if (cell.isRowSpanned) return null;
  else
    return (
      <td
        style={borderStyle}
        rowSpan={cell.rowSpan}
        {...cell.getCellProps()}
      >
        {cell.render("Cell")}
      </td>
    );
}

function useInstance(instance:any) {
  const { allColumns } = instance;

  let rowSpanHeaders:any = [];

  allColumns.forEach((column:any, i:any) => {
    const { id } = column;
      rowSpanHeaders = [
        ...rowSpanHeaders,
        { id, topCellValue: null, topCellIndex: 0 }
      ];
  });

  Object.assign(instance, { rowSpanHeaders });
}
type TableProperties = {
  data: TableRows
};
export function Table(properties: TableProperties){
  /** all info needed to operate. On future will be params */
  const mockedData:TableDataType = makeData(10);
  /** Columns information */
  const columns = mockedData.columns;
  /** Rows information */
  const sourceData: TableRows = properties.data;
  /** Rows showed information */
  const data = React.useMemo(() => filterDataWithcolumHeaders(sourceData,columns.map(column => column.Header)), []);
  let propsUseTable:any = {columns, data};
  /** Hook to use react-table */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(propsUseTable, hooks => {
    hooks.useInstance.push(useInstance);
  });
/** return table structure */
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={borderStyle}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return renderRow(row);
        })}
      </tbody>
    </table>
  );
}

function filterDataWithcolumHeaders(data:TableRows,columnHeaders:string[]): TableRows{
  let filterData:TableRows = [];
  let id:number = 0;
  data.forEach(row => {
    let newRow:TableRow={
      id: ++id
    };
    columnHeaders.forEach(columnHeader => {
      newRow[columnHeader] = row[columnHeader] ? row[columnHeader] : '';
    });
    filterData.push(newRow);
  });
  return filterData;
}