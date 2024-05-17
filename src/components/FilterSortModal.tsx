// FilterSortModal.tsx
import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataItem } from "../types";

interface FilterSortModalProps {
  open: boolean;
  onClose: () => void;
  filterFinished: boolean | null;
  filterPaymentReceived: boolean | null;
  setFilterFinished: (value: boolean | null) => void;
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
  filterFinished,
  filterPaymentReceived,
  setFilterFinished,
  setFilterPaymentReceived,
  orderBy,
  setOrderBy,
  order,
  setOrder,
  clearFilters,
}) => {
  const handleFilterChange = (
    filterSetter: (value: boolean | null) => void,
    currentValue: boolean | null
  ) => {
    filterSetter(
      currentValue === null ? true : currentValue === true ? false : null
    );
  };

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
        <FormControlLabel
          control={
            <Checkbox
              checked={filterFinished === true}
              indeterminate={filterFinished === false}
              onChange={() =>
                handleFilterChange(setFilterFinished, filterFinished)
              }
              color="primary"
            />
          }
          label="Finished"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filterPaymentReceived === true}
              indeterminate={filterPaymentReceived === false}
              onChange={() =>
                handleFilterChange(
                  setFilterPaymentReceived,
                  filterPaymentReceived
                )
              }
              color="primary"
            />
          }
          label="Payment Received"
        />
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
