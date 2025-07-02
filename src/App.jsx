import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Download, Upload, Share2, Plus, Filter, ArrowUpDown, Eye, MoreHorizontal, X } from 'lucide-react';

// Mock data based on the screenshot
const mockData = [
  {
    id: 1,
    task: "Launch social media campaign for product promotion",
    dueDate: "15-11-2024",
    status: "In-progress",
    submitter: "Asha Patel",
    url: "www.ashapatel...",
    assignee: "Sophie Choudhury",
    priority: "Medium",
    createdDate: "20-11-2024",
    estimate: "6,500.00"
  },
  {
    id: 2,
    task: "Update press kit for company redesign",
    dueDate: "26-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan...",
    assignee: "Tejas Panday",
    priority: "High",
    createdDate: "30-10-2024",
    estimate: "3,500.00"
  },
  {
    id: 3,
    task: "Finalize user testing feedback for app improvements",
    dueDate: "05-12-2024",
    status: "In-progress",
    submitter: "Mark Johnson",
    url: "www.markjohns...",
    assignee: "Rachel Lee",
    priority: "Medium",
    createdDate: "15-12-2024",
    estimate: "4,750.00"
  },
  {
    id: 4,
    task: "Design new feature for the website",
    dueDate: "30-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen...",
    assignee: "Tom Wright",
    priority: "Low",
    createdDate: "15-01-2025",
    estimate: "5,800.00"
  },
  {
    id: 5,
    task: "Prepare financial report for Q4",
    dueDate: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabro...",
    assignee: "Kevin Smith",
    priority: "",
    createdDate: "30-01-2025",
    estimate: "2,800.00"
  }
];

const SpreadsheetApp = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCell, setActiveCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [data, setData] = useState(mockData);
  const tableRef = useRef(null);

  const tabs = ['All Orders', 'Pending', 'Reviewed', 'Arrived'];
  
  const columns = [
    { key: 'checkbox', header: '', width: '40px' },
    { key: 'task', header: 'Task Request', width: '250px' },
    { key: 'submitted', header: 'Submitted', width: '100px' },
    { key: 'status', header: 'Status', width: '120px' },
    { key: 'submitter', header: 'Submitter', width: '120px' },
    { key: 'url', header: 'URL', width: '140px' },
    { key: 'assignee', header: 'Assignee', width: '140px' },
    { key: 'priority', header: 'Priority', width: '100px' },
    { key: 'dueDate', header: 'Due Date', width: '120px' },
    { key: 'estimate', header: 'Est. Value', width: '120px' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In-progress': return 'bg-yellow-100 text-yellow-800';
      case 'Need to start': return 'bg-gray-100 text-gray-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  const handleCellClick = (rowIndex, colKey) => {
    const cellId = `${rowIndex}-${colKey}`;
    setActiveCell(cellId);
    console.log(`Cell clicked: Row ${rowIndex}, Column ${colKey}`);
  };

  const handleCellDoubleClick = (rowIndex, colKey) => {
    const cellId = `${rowIndex}-${colKey}`;
    setEditingCell(cellId);
    console.log(`Cell editing: Row ${rowIndex}, Column ${colKey}`);
  };

  const handleKeyDown = (e) => {
    if (!activeCell) return;
    
    const [rowIndex, colKey] = activeCell.split('-');
    const currentRowIndex = parseInt(rowIndex);
    const currentColIndex = columns.findIndex(col => col.key === colKey);
    
    let newRowIndex = currentRowIndex;
    let newColIndex = currentColIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRowIndex = Math.max(0, currentRowIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRowIndex = Math.min(data.length - 1, currentRowIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newColIndex = Math.max(1, currentColIndex - 1); // Skip checkbox column
        break;
      case 'ArrowRight':
        e.preventDefault();
        newColIndex = Math.min(columns.length - 1, currentColIndex + 1);
        break;
      case 'Enter':
        e.preventDefault();
        handleCellDoubleClick(currentRowIndex, colKey);
        break;
      case 'Escape':
        setEditingCell(null);
        break;
    }
    
    if (newRowIndex !== currentRowIndex || newColIndex !== currentColIndex) {
      const newCellId = `${newRowIndex}-${columns[newColIndex].key}`;
      setActiveCell(newCellId);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCell]);

  const renderCell = (item, column, rowIndex) => {
    const cellId = `${rowIndex}-${column.key}`;
    const isActive = activeCell === cellId;
    const isEditing = editingCell === cellId;
    
    const baseCellClass = `px-3 py-2 border-r border-gray-200 text-sm cursor-cell transition-colors ${
      isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
    }`;

    if (column.key === 'checkbox') {
      return (
        <td key={column.key} className={baseCellClass} style={{ width: column.width }}>
          <input type="checkbox" className="w-4 h-4 text-blue-600" />
        </td>
      );
    }

    if (column.key === 'status') {
      return (
        <td 
          key={column.key} 
          className={baseCellClass} 
          style={{ width: column.width }}
          onClick={() => handleCellClick(rowIndex, column.key)}
          onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
        >
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </td>
      );
    }

    if (column.key === 'priority') {
      return (
        <td 
          key={column.key} 
          className={baseCellClass} 
          style={{ width: column.width }}
          onClick={() => handleCellClick(rowIndex, column.key)}
          onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
        >
          {item.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          )}
        </td>
      );
    }

    const cellValue = column.key === 'submitted' ? item.dueDate :
                     column.key === 'dueDate' ? item.createdDate :
                     column.key === 'estimate' ? `$${item.estimate}` :
                     item[column.key] || '';

    return (
      <td 
        key={column.key} 
        className={baseCellClass} 
        style={{ width: column.width }}
        onClick={() => handleCellClick(rowIndex, column.key)}
        onDoubleClick={() => handleCellDoubleClick(rowIndex, column.key)}
      >
        {isEditing ? (
          <input
            type="text"
            defaultValue={cellValue}
            className="w-full bg-white border border-blue-500 px-1 py-0 text-sm focus:outline-none"
            autoFocus
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
          />
        ) : (
          <span className={column.key === 'url' ? 'text-blue-600 underline' : ''}>
            {cellValue}
          </span>
        )}
      </td>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col" tabIndex={0}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">📊</span>
            </div>
            <span className="font-medium">Workspace</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Folder</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded text-sm">
            Spreadsheet 3
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
            <span className="w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-xs">A</span>
            <span>2</span>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search within sheet"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">John Doe</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-2 text-sm font-medium"
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          >
            <span>Tool bar</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <button className="flex items-center space-x-2 text-sm">
            <Eye className="w-4 h-4" />
            <span>Hide fields</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm">
            <MoreHorizontal className="w-4 h-4" />
            <span>Cell view</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Import clicked')}
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Export clicked')}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
            onClick={() => console.log('Share clicked')}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            onClick={() => console.log('New Action clicked')}
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-orange-100 rounded">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm font-medium">Financial Forecast</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase tracking-wide px-2">ABC</div>
              <div className="text-xs text-gray-500 px-2">Answer a question</div>
              <div className="text-xs text-orange-500 px-2">Extract</div>
            </div>
          </div>
        </div>

        {/* Spreadsheet Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  console.log(`Tab switched to: ${tab}`);
                }}
              >
                {tab}
              </button>
            ))}
            <button 
              className="px-2 py-2 text-gray-400 hover:text-gray-600"
              onClick={() => console.log('Add new tab')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Spreadsheet Table */}
          <div className="flex-1 overflow-auto bg-white">
            <table ref={tableRef} className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, rowIndex) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => renderCell(item, column, rowIndex))}
                  </tr>
                ))}
                
                {/* Empty rows for spreadsheet feel */}
                {Array.from({ length: 15 }, (_, i) => (
                  <tr key={`empty-${i}`} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-3 py-2 border-r border-gray-200 text-sm cursor-cell hover:bg-gray-50"
                        style={{ width: column.width, height: '36px' }}
                        onClick={() => handleCellClick(data.length + i, column.key)}
                      >
                        {column.key === 'checkbox' && (
                          <input type="checkbox" className="w-4 h-4 text-blue-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Row Numbers */}
          <div className="absolute left-64 top-32 w-8 bg-gray-50 border-r border-gray-200">
            <div className="sticky top-0 bg-gray-50 h-10 border-b border-gray-200"></div>
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="h-9 flex items-center justify-center text-xs text-gray-500 border-b border-gray-100">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              <span className="w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-xs">V</span>
              <span>2</span>
            </div>
            <button onClick={() => console.log('Close panel')}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select cells or use the panel to interact with your data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetApp;