import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableSortLabel,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { Done, Clear, Edit, FilterList } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { DataItem } from "../types";

interface OrderTableProps {
  data: DataItem[];
  orderBy: keyof DataItem;
  order: "asc" | "desc";
  handleRequestSort: (property: keyof DataItem) => void;
  handleEdit: (order: DataItem) => void;
  setFilterStatusModalOpen: (value: boolean) => void;
  filterPaymentReceived: boolean | null;
  setFilterPaymentReceived: (value: boolean | null) => void;
}

const statusColor: { [key: string]: string } = {
  Contact: "lightblue",
  Order: "lightgreen",
  Printing: "lightyellow",
  Printed: "lightcoral",
  Finished: "lightgray",
  Sent: "lightsalmon",
};

const OrderTable: React.FC<OrderTableProps> = ({
  data,
  orderBy,
  order,
  handleRequestSort,
  handleEdit,
  setFilterStatusModalOpen,
  filterPaymentReceived,
  setFilterPaymentReceived,
}) => {
  const getFilterIcon = (filter: boolean | null) => {
    if (filter === true) return <Done />;
    if (filter === false) return <Clear />;
    return <FilterList />;
  };

  const handleFilterToggle = (
    filter: boolean | null,
    setFilter: (value: boolean | null) => void
  ) => {
    setFilter(filter === null ? true : filter === true ? false : null);
  };

  const sortedData = [...data].sort((a, b) => {
    if (orderBy === "date_of_order") {
      const dateA = new Date(a.date_of_order).getTime();
      const dateB = new Date(b.date_of_order).getTime();
      console.log(a.date_of_order, b.date_of_order);
      console.log(dateA, dateB);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    } else if (orderBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    } else {
      const valueA = a[orderBy] as string | number;
      const valueB = b[orderBy] as string | number;
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    }
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
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
                direction={orderBy === "date_of_order" ? order : "asc"}
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
                    Length <br /> Height
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
                direction={orderBy === "source_of_order" ? order : "asc"}
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
            <TableCell>
              <Box display="flex" alignItems="center">
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
                <IconButton
                  onClick={() => setFilterStatusModalOpen(true)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <FilterList />
                </IconButton>
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center">
                <TableSortLabel
                  active={orderBy === "payment_received"}
                  direction={orderBy === "payment_received" ? order : "asc"}
                  onClick={() => handleRequestSort("payment_received")}
                >
                  Payment Received
                </TableSortLabel>
                <IconButton
                  onClick={() =>
                    handleFilterToggle(
                      filterPaymentReceived,
                      setFilterPaymentReceived
                    )
                  }
                  size="small"
                  sx={{ ml: 1 }}
                >
                  {getFilterIcon(filterPaymentReceived)}
                </IconButton>
              </Box>
            </TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow
              key={item.id}
              sx={{ backgroundColor: statusColor[item.status] }}
            >
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "90%" }}
                  noWrap
                  align="center"
                >
                  {format(item.date_of_order, "dd-MM-yyyy")}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{item.nickname}</Typography>
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
                <Typography align="center">{item.source_of_order}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{item.payment}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">{item.status}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="center">
                  {item.payment_received ? (
                    <Done color="primary" />
                  ) : (
                    <Clear color="secondary" />
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <Tooltip title={item.description}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: "70%", maxWidth: "100px" }}
                    noWrap
                  >
                    {item.description}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
