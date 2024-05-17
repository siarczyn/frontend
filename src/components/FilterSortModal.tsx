import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataItem } from "../types";

interface FilterSortModalProps {
  open: boolean;
  onClose: () => void;
  filterStatus: string | null;
  filterPaymentReceived: boolean | null;
  setFilterStatus: (value: string | null) => void;
  setFilterPaymentReceived: (value: boolean | null) => void;
  orderBy: keyof DataItem;
  setOrderBy: (value: keyof DataItem) => void;
  order: "asc" | "desc";
  setOrder: (value: "asc" | "desc") => void;
  clearFilters: () => void;
}

const FilterSortModal: React.FC<FilterSortModalProps> = ({
  open,
  onClose,
  filterStatus,
  filterPaymentReceived,
  setFilterStatus,
  setFilterPaymentReceived,
  orderBy,
  setOrderBy,
  order,
  setOrder,
  clearFilters,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter and Sort
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Contact">Contact</MenuItem>
            <MenuItem value="Order">Order</MenuItem>
            <MenuItem value="Printing">Printing</MenuItem>
            <MenuItem value="Printed">Printed</MenuItem>
            <MenuItem value="Finished">Finished</MenuItem>
            <MenuItem value="Sent">Sent</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="order-by-label">Order By</InputLabel>
          <Select
            labelId="order-by-label"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as keyof DataItem)}
          >
            <MenuItem value="date_of_order">Date of Order</MenuItem>
            <MenuItem value="nickname">Nickname</MenuItem>
            <MenuItem value="color">Color</MenuItem>
            <MenuItem value="size_x">Size</MenuItem>
            <MenuItem value="entry">Entry</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="source_of_order">Order Source</MenuItem>
            <MenuItem value="payment">Payment</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="order-direction-label">Order Direction</InputLabel>
          <Select
            labelId="order-direction-label"
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterSortModal;
