import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          {/* Links aligned to the left */}
          <Button component={Link} to="/leads" color="inherit">
            Leads
          </Button>
          <Button component={Link} to="/owners" color="inherit">
            Owners
          </Button>
          <Button component={Link} to="/agents" color="inherit">
            Agents
          </Button>
          <Button component={Link} to="/docs" color="inherit">
            Docs
          </Button>
        </Box>
        {/* Link aligned to the right */}
        <Button component={Link} to="/" color="inherit" sx={{ float: 'right' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
