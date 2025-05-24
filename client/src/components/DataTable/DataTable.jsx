import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import './DataTable.css';

const DataTable = ({ 
  title, 
  columns, 
  data, 
  actions,
  onActionClick,
  statusConfig
}) => {
  return (
    <div className="data-table">
      {title && <h5 className="table-title">{title}</h5>}
      <Table responsive>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.key === 'status' && statusConfig ? (
                    <Badge bg={statusConfig[row[column.key]]?.color || 'secondary'}>
                      {row[column.key]}
                    </Badge>
                  ) : (
                    column.render ? column.render(row[column.key], row) : row[column.key]
                  )}
                </td>
              ))}
              {actions && (
                <td>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'outline-primary'}
                      size="sm"
                      className={index > 0 ? 'ms-2' : ''}
                      onClick={() => onActionClick(action.type, row)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable; 