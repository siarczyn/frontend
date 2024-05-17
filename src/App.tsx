import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useMediaQuery,
  ThemeProvider,
  CircularProgress,
  Box,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import { Done, Clear, Edit, Add, FilterList } from "@mui/icons-material";
import theme from "./theme";
import { format } from "date-fns";
import OrderForm from "./OrderForm";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.1.88:5001/api/data");
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
      size_x: 0,
      size_y: 0,
      size_z: 0,
      color: "",
      entry: "",
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
      await axios.delete(`http://192.168.1.88:5001/api/data/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleRequestSort = (property: keyof DataItem) => {
    if (property === "finished") {
      setFilterFinished((prev) =>
        prev === null ? true : prev === true ? false : null
      );
    } else if (property === "payment_received") {
      setFilterPaymentReceived((prev) =>
        prev === null ? true : prev === true ? false : null
      );
    } else {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    }
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

  const getFilterIcon = (filter: boolean | null) => {
    if (filter === true) return <Done />;
    if (filter === false) return <Clear />;
    return <FilterList />;
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
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          width: isMobile ? "95vw" : "100vw",
        }}
      >
        {currentOrder ? (
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
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  width: isMobile ? "95%" : "100%",
                  minWidth: {
                    xs: "100%",
                    sm: "1200px",
                    md: "1200px",
                    lg: "1400px",
                  },
                }}
              >
                <Table aria-label="mask orders table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "date_of_order"}
                          direction={
                            orderBy === "date_of_order" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("date_of_order")}
                        >
                          Date of Order
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "nickname"}
                          direction={orderBy === "nickname" ? order : "asc"}
                          onClick={() => handleRequestSort("nickname")}
                        >
                          Nickname
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "color"}
                          direction={orderBy === "color" ? order : "asc"}
                          onClick={() => handleRequestSort("color")}
                        >
                          Color
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <span>
                              Width
                              <br />
                              Length <br /> Heigth
                            </span>
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "size_x"}
                            direction={orderBy === "size_x" ? order : "asc"}
                            onClick={() => handleRequestSort("size_x")}
                          >
                            Size
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "entry"}
                          direction={orderBy === "entry" ? order : "asc"}
                          onClick={() => handleRequestSort("entry")}
                        >
                          Entry
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "price"}
                          direction={orderBy === "price" ? order : "asc"}
                          onClick={() => handleRequestSort("price")}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "source_of_order"}
                          direction={
                            orderBy === "source_of_order" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("source_of_order")}
                        >
                          Order Source
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "payment"}
                          direction={orderBy === "payment" ? order : "asc"}
                          onClick={() => handleRequestSort("payment")}
                        >
                          Payment
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>
                        <Tooltip title="Filter by Finished">
                          <Box sx={{ display: " flex", flexDirection: "row" }}>
                            <Typography sx={{ pt: 1 }}>Printed</Typography>
                            <IconButton
                              onClick={() => handleRequestSort("finished")}
                            >
                              {getFilterIcon(filterFinished)}
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Filter by Payment Received">
                          <Box sx={{ display: " flex", flexDirection: "row" }}>
                            <Typography sx={{ pt: 1 }}>Paid</Typography>
                            <IconButton
                              onClick={() =>
                                handleRequestSort("payment_received")
                              }
                            >
                              {getFilterIcon(filterPaymentReceived)}
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData().map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontSize: "90%" }}
                            noWrap
                            align="center"
                          >
                            {format(new Date(item.date_of_order), "dd-MM-yyyy")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">
                            {item.nickname}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">{item.color}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">
                            {item.size_x} <br /> {item.size_y}
                            <br /> {item.size_z}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">{item.entry}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Discount: ${item.discount}%`}>
                            <Typography>{item.price}</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">
                            {item.source_of_order}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography align="center">{item.payment}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item.description}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: "70%" }}
                              noWrap
                            >
                              {item.description}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            {item.finished ? (
                              <Done color="primary" />
                            ) : (
                              <Clear color="secondary" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            {item.payment_received ? (
                              <Done color="primary" />
                            ) : (
                              <Clear color="secondary" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(item)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        {/* <TableCell>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(item.id)}>
                              <Clear />
                            </IconButton>
                          </Tooltip>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
