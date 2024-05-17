// OrderTable.tsx
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
import {
  Done,
  Clear,
  Edit,
  FilterList,
  IndeterminateCheckBox,
  CheckBox,
} from "@mui/icons-material";
import { format } from "date-fns";
import { DataItem } from "./types";

interface OrderTableProps {
  data: DataItem[];
  orderBy: keyof DataItem;
  order: "asc" | "desc";
  handleRequestSort: (property: keyof DataItem) => void;
  handleEdit: (order: DataItem) => void;
  filterFinished: boolean | null;
  setFilterFinished: (value: boolean | null) => void;
  filterPaymentReceived: boolean | null;
  setFilterPaymentReceived: (value: boolean | null) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  data,
  orderBy,
  order,
  handleRequestSort,
  handleEdit,
  filterFinished,
  setFilterFinished,
  filterPaymentReceived,
  setFilterPaymentReceived,
}) => {
  const getFilterIcon = (filter: boolean | null) => {
    if (filter === true) return <CheckBox />;
    if (filter === false) return <Clear />;
    return <FilterList />;
  };

  const handleFilterToggle = (
    filter: boolean | null,
    setFilter: (value: boolean | null) => void
  ) => {
    setFilter(filter === null ? true : filter === true ? false : null);
  };

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
                  active={orderBy === "finished"}
                  direction={orderBy === "finished" ? order : "asc"}
                  onClick={() => handleRequestSort("finished")}
                >
                  Finished
                </TableSortLabel>
                <IconButton
                  onClick={() =>
                    handleFilterToggle(filterFinished, setFilterFinished)
                  }
                  size="small"
                  sx={{ ml: 1 }}
                >
                  {getFilterIcon(filterFinished)}
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
          {data.map((item) => (
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
                <Typography align="center">
                  {item.finished ? (
                    <Done color="primary" />
                  ) : (
                    <Clear color="secondary" />
                  )}
                </Typography>
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
                    sx={{ fontSize: "70%" }}
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
  );
};

export default OrderTable;
