import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        {children}
      </table>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, onClick }) => {
  return (
    <tr 
      className={onClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
};

const TableHeaderCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell };