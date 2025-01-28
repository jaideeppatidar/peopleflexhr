import React, { useState } from 'react';
import { 
  Button,
  Checkbox,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { CheckCircle, Error, SkipNext } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './FinalSummary.css'
const TABS = {
  ADDED: 'added',
  FAILED: 'failed'
};

const STATUS_ICONS = {
  success: { icon: CheckCircle, color: 'green' },
  error: { icon: Error, color: 'red' },
  skipped: { icon: SkipNext, color: 'black' }
};

const TableHeader = ({ columns, onSelectAll, isAllSelected, isIndeterminate }) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      </TableCell>
      {columns.map(column => (
        <TableCell key={column} style={{ fontWeight: 'bold' }}>
          {column}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const StatusIcon = ({ status }) => {
  const { icon: Icon, color } = STATUS_ICONS[status] || STATUS_ICONS.skipped;
  return <Icon style={{ color }} />;
};

const DataTableRow = ({ item, isSelected, onSelect, columns }) => (
  <TableRow hover>
    <TableCell padding="checkbox">
      <Checkbox
        checked={isSelected}
        onChange={() => onSelect(item.id)}
      />
    </TableCell>
    {columns.map(column => (
      <TableCell key={column}>
        {column.includes('Info') || column.includes('Details') ? (
          <StatusIcon status={item[column]} />
        ) : (
          item[column]
        )}
      </TableCell>
    ))}
  </TableRow>
);

const Legend = () => (
  <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
    {Object.entries(STATUS_ICONS).map(([key, { icon: Icon, color }]) => (
      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon style={{ color }} />
        <span style={{ textTransform: 'capitalize' }}>{key}</span>
      </div>
    ))}
  </div>
);

const FinalSummary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.ADDED);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const mockData = {
    [TABS.ADDED]: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        personalInfo: 'success',
        contactInfo: 'success',
        sensitiveInfo: 'skipped',
        emergencyContact: 'skipped',
        bankDetails: 'error'
      }
    ],
    [TABS.FAILED]: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        description: 'Import failed'
      }
    ]
  };

  const columns = {
    [TABS.ADDED]: ['name', 'email', 'personalInfo', 'contactInfo', 'sensitiveInfo', 'emergencyContact', 'bankDetails'],
    [TABS.FAILED]: ['name', 'email', 'description']
  };

  const currentData = mockData[activeTab];
  const isAllSelected = currentData.length > 0 && selectedIds.size === currentData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < currentData.length;

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(currentData.map(item => item.id)) : new Set());
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className='FinalSummaryContainer'>
           <div className='FinalSummaryHeader'>
            <div className='HeddingFinalSummary'>Summary</div>
            <div className='UnderlineHeading'></div>

           </div>

      <div className="added-failed-container">
        <div className='ActiveButtonFinalSummary' style={{ marginBottom: '20px' }}>
          {Object.values(TABS).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${tab}-btn ${activeTab === tab ? 'underline' : ''}`}
              style={{ marginRight: '10px' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent style={{ padding: 0 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHeader
                  columns={columns[activeTab]}
                  onSelectAll={handleSelectAll}
                  isAllSelected={isAllSelected}
                  isIndeterminate={isIndeterminate}
                />
                <TableBody>
                  {currentData.map((item) => (
                    <DataTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedIds.has(item.id)}
                      onSelect={handleSelect}
                      columns={columns[activeTab]}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Legend />
      </div>

      
        <div className="FinalSummaryButtonContainer">
          <div>
          <button
            className="FinalSummaryButtonStart"
            onClick={() => navigate("/superadmin/empdetails")}
          >
            Start Over
          </button>
          </div>
          <div className='FinalAllContainer'>
          <button
            className="FinalSummaryButtonBack"
            onClick={() => navigate("/superadmin/empsummary")}
          >
            Back
          </button>
          <button
            className="AddNextButton"
            onClick={() => navigate("/superadmin/addemployee")}
          >
           Save & Continue
          </button>
          </div>
        </div>
      
    </div>
  );
};

export default FinalSummary;