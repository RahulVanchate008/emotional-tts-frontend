import React from 'react';
import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, InputBase, Badge, Button,
  Divider
} from '@mui/material';
import { borderColor, styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { History, Settings, BarChart, Logout } from '@mui/icons-material';
import ChatBox from '../components/ChatBox/ChatBox'; // Your ChatBox component
import { red } from '@mui/material/colors';

const drawerWidth = 300;

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  backgroundColor: '#1f1f2e',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  marginLeft: theme.spacing(2),
  width: '100%',
}));

const AppLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e2e' }}>
      <CssBaseline />

      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#252538',
            color: '#fff',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h5">Map Communications</Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary="Text to Speech Services" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Speech to Speech Services" />
            <Button size="small" variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Pro
            </Button>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Voices" />
            <Button size="small" variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Pro
            </Button>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Elevenlabs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Google Neural Voices" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Tacotron2 + HiFi GAN" />
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Pro Plan Promotion */}
        <Box style={{marginBottom:15}} sx={{ p: 3, backgroundColor: '#3c3c5c', borderRadius: 2, mx: 2, }} >
          <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
            Premium Plan
          </Typography>
          <Typography variant="body2" sx={{ color: '#ddd', mb: 2 }}>
            Strengthen communication services. Get the plan now!
          </Typography>
          <Button fullWidth variant="contained" color="primary">
            Get Premium!
          </Button>
        </Box>
      </Drawer>

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: 1960,
          marginRight:37.5,
          ml: drawerWidth,
          backgroundColor: '#2b2b3d',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            startAdornment={<SearchIcon />}
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <Badge badgeContent={6} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar sx={{ ml: 2 }}>R</Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ChatBox />
      </Box>

      {/* Right Sidebar */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#252538',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, marginTop:0 }}>
          <Typography variant="h5">Chat History</Typography>
          <List>
            <ListItem button>
              <ListItemText primary="What are the hours of the operation?"/>
            </ListItem>
            <ListItem button>
              <ListItemText primary="Will my cake be boxed?"/>
            </ListItem>
            <ListItem button>
              <ListItemText primary="Do you deliver wedding cakes?" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Is there outdoor seating available?" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="What kind of icing do you use?" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Do you offer gluten free and diabetic friendly items?" />
            </ListItem>
          </List>
          <Button Logout fullWidth variant="contained" color='error' style={{marginTop:740}}>
            <Logout/> Logout
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AppLayout;
