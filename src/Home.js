import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useTable } from 'react-table';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardMedia,Grid } from '@mui/material';
import Navbar from './Navbar';
import { Chart, registerables } from 'chart.js';

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
    data: [200, 300, 25, 400],
    fill: true,
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
    <Box p={2}>
      <Navbar />
    

     {/* Sales and Expenses Charts Side by Side */}
<Typography variant="h5" gutterBottom>
  Sales and Expenses
</Typography>
<Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        width: '100%',
        height: '300px', // Set a fixed height to keep both charts consistent
      }}
    >
      <Typography variant="h6">Sales Chart</Typography>
      <Bar data={barChartData} />
    </Box>
  </Grid>

  <Grid item xs={12} md={6}>
    <Box
      sx={{
        width: '100%',
        height: '300px',
      }}
    >
      <Typography variant="h6">Expenses Chart</Typography>
      <Line data={lineChartData} />
    </Box>
  </Grid>
</Grid>

      {/* Sample Image */}
      <Typography variant="h5" gutterBottom>
        Sample Image
      </Typography>
      <Card sx={{ maxWidth: 600, mb: 4 }}>
        <CardMedia
          component="img"
          height="900"
          image="https://www.cabkgoyal.com/wp-content/uploads/2023/05/rent-agreement.png"
          alt="Sample Rent Agreement"
        />
      </Card>

      {/* User Data Table */}
      <Typography variant="h5" gutterBottom>
        User Data
      </Typography>
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;
