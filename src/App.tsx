// src/App.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import { Link, Route, Routes } from "react-router-dom";
import theme from "./theme";
import OrderForm from "./components/OrderForm";
import OrderCard from "./components/OrderCard";
import FilterSortModal from "./components/FilterSortModal";
import OrderTable from "./components/OrderTable";
import ColourTable from "./components/ColourTable";
import FilamentTable from "./components/FilamentTable";
import { DataItem } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentOrder, setCurrentOrder] = useState<DataItem | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof DataItem>("date_of_order");
  const [filterFinished, setFilterFinished] = useState<boolean | null>(null);
  const [filterPaymentReceived, setFilterPaymentReceived] = useState<
    boolean | null
  >(null);
  const [filterSortModalOpen, setFilterSortModalOpen] =
    useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/data`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (order: DataItem) => {
    if (currentOrder && currentOrder.id !== 0) {
      setData((prevState) =>
        prevState.map((item) => (item.id === order.id ? order : item))
      );
    } else {
      setData((prevState) => [...prevState, order]);
    }
    setCurrentOrder(null);
  };

  const handleEdit = (order: DataItem) => {
    setCurrentOrder(order);
  };

  const handleCancel = () => {
    setCurrentOrder(null);
  };

  const handleAdd = () => {
    setCurrentOrder({
      id: 0,
      size_x: 23,
      size_y: 17,
      size_z: 14,
      color: "",
      entry: "18 standard",
      payment: "",
      payment_status: "",
      discount: 0,
      date_of_order: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
      finished: false,
      payment_received: false,
      source_of_order: "",
      nickname: "",
      description: "",
      price: 0,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/data/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleRequestSort = (property: keyof DataItem) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const clearFilters = () => {
    setFilterFinished(null);
    setFilterPaymentReceived(null);
  };

  const filteredData = () => {
    return data.filter((item) => {
      if (filterFinished !== null && item.finished !== filterFinished)
        return false;
      if (
        filterPaymentReceived !== null &&
        item.payment_received !== filterPaymentReceived
      )
        return false;
      return true;
    });
  };

  const sortedData = () => {
    return filteredData()
      .slice()
      .sort((a, b) => {
        if (b[orderBy] < a[orderBy]) {
          return order === "asc" ? -1 : 1;
        }
        if (b[orderBy] > a[orderBy]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            EquineInhaler
          </Typography>
          <Tooltip title="Add Order">
            <IconButton color="inherit" onClick={handleAdd}>
              <Add />
            </IconButton>
          </Tooltip>
          <Button component={Link} to="/colours" color="inherit">
            Manage Colours
          </Button>
          <Button component={Link} to="/filaments" color="inherit">
            Manage Filaments
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isMobile ? "95vw" : "100vw",
          minHeight: "100vw",
          pb: 5,
        }}
      >
        <Routes>
          <Route path="/colours" element={<ColourTable />} />
          <Route path="/filaments" element={<FilamentTable />} />
          <Route
            path="/"
            element={
              currentOrder ? (
                <OrderForm
                  order={currentOrder}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              ) : (
                <>
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="50vh"
                    >
                      <CircularProgress />
                    </Box>
                  ) : isMobile ? (
                    <>
                      {sortedData().map((item) => (
                        <OrderCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                        />
                      ))}
                      <Fab
                        color="primary"
                        aria-label="filter"
                        sx={{ position: "fixed", bottom: 16, right: 16 }}
                        onClick={() => setFilterSortModalOpen(true)}
                      >
                        <FilterList />
                      </Fab>
                      <FilterSortModal
                        open={filterSortModalOpen}
                        onClose={() => setFilterSortModalOpen(false)}
                        filterFinished={filterFinished}
                        filterPaymentReceived={filterPaymentReceived}
                        setFilterFinished={setFilterFinished}
                        setFilterPaymentReceived={setFilterPaymentReceived}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        order={order}
                        setOrder={setOrder}
                        clearFilters={clearFilters}
                      />
                    </>
                  ) : (
                    <OrderTable
                      data={sortedData()}
                      orderBy={orderBy}
                      order={order}
                      handleRequestSort={handleRequestSort}
                      handleEdit={handleEdit}
                      filterFinished={filterFinished}
                      setFilterFinished={setFilterFinished}
                      filterPaymentReceived={filterPaymentReceived}
                      setFilterPaymentReceived={setFilterPaymentReceived}
                    />
                  )}
                </>
              )
            }
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
