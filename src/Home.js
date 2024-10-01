import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useTable } from 'react-table';
import Navbar from './Navbar';
import { Chart, registerables } from 'chart.js';
import './Home.css';

Chart.register(...registerables);

const barChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Sales',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
  }],
};

const lineChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{
    label: 'Expenses',
    data: [200, 300, 250, 400],
    fill: false,
    backgroundColor: 'rgba(153, 102, 255, 0.6)',
    borderColor: 'rgba(153, 102, 255, 1)',
    tension: 0.1,
  }],
};

const tableData = [
  { id: 1, name: 'John Doe', age: 28, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com' },
  { id: 3, name: 'Alice Johnson', age: 45, email: 'alice@example.com' },
  { id: 4, name: 'Bob Brown', age: 23, email: 'bob@example.com' },
];

const columns = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'Name', accessor: 'name' },
  { Header: 'Age', accessor: 'age' },
  { Header: 'Email', accessor: 'email' },
];

const Home = () => {
  const data = useMemo(() => tableData, []);
  const columnDefs = useMemo(() => columns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: columnDefs, data });

  return (
    <div className="container">
      <Navbar />
      <h1>Welcome to the Dashboard!</h1>

      <h2>Sales Chart</h2>
      <div style={{ width: '400px', height: '300px' }}>
        <Bar data={barChartData} />
      </div>

      <h2>Expenses Chart</h2>
      <div style={{ width: '400px', height: '300px' }}>
        <Line data={lineChartData} />
      </div>

      <h2>Sample Image</h2>
      <img 
        src="https://www.cabkgoyal.com/wp-content/uploads/2023/05/rent-agreement.png" // Replace with the direct image URL
        alt="Sample Rent Agreement" 
        style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }} 
      />

      <h2>User Data</h2>
      <table {...getTableProps()} style={{ width: '100%', marginTop: '20px', border: '1px solid #ddd' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
