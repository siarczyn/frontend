import React, { useEffect, useState } from "react";
import { useNavigate, Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import Keycloak from 'keycloak-js';

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CircularProgress,
  Box,
  Tooltip,
  IconButton,
  Fab,
  useMediaQuery,
  ThemeProvider,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, FilterList, Palette, Category } from "@mui/icons-material";
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import initKeycloak from './keycloak';import theme from "./theme";
import OrderForm from "./components/OrderForm";
import OrderCard from "./components/OrderCard";
import FilterSortModal from "./components/FilterSortModal";
import OrderTable from "./components/OrderTable";
import ColourTable from "./components/ColourTable";
import FilamentTable from "./components/FilamentTable";
import { DataItem } from "./types";


const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  const [orders, setOrders] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!initialized) {
    return <CircularProgress />;
  }

  if (!keycloak.authenticated) {
    return (
      <div>
        <Typography variant="h6">Not authenticated</Typography>
        <Button variant="contained" onClick={() => keycloak.login()}>Login</Button>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Order Management</Typography>
          <Button color="inherit" onClick={() => keycloak.logout()}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" gutterBottom>
          Welcome, {keycloak.tokenParsed?.name}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6">Order Management1</Typography>
        )}
        <Tooltip title="Filter Orders">
          <IconButton onClick={() => setOpenFilterModal(true)}>
            <FilterList />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">Order Management2</Typography>
        <Fab color="primary" aria-label="add" component={Link} to="/orders/new">
          <Add />
        </Fab>
      </Container>
      <Routes>
      <Typography variant="h6">Order Management3</Typography>
        <Route path="/colours" element={<ColourTable />} />
        <Route path="/filaments" element={<FilamentTable />} />
      </Routes>
    </ThemeProvider>
  );
};

const WrappedApp = () => {
  const keycloak: Keycloak = initKeycloak();  return(
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
)};

export default WrappedApp;