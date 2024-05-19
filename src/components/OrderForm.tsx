import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataItem } from "../types";
import theme from "../theme";
import { colorOptions, paymentOptions, statusOptions } from "../options";

interface Filament {
  id: number;
  size: number;
  amount_used: number;
  date_of_addition: string;
  material: string;
  colour_name: string;
}

interface OrderFormProps {
  order?: DataItem;
  onSave: (order: DataItem) => void;
  onCancel: () => void;
  onDelete: (id: number) => Promise<void>;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onSave,
  onCancel,
  onDelete,
}) => {
  const initialState: DataItem = order || {
    id: 0,
    size_x: 0,
    size_y: 0,
    size_z: 0,
    color: "",
    entry: "",
    payment: "",
    payment_status: "",
    discount: 0,
    date_of_order: new Date().toISOString().slice(0, 10),
    status: statusOptions[0], // Default status
    payment_received: false,
    source_of_order: "",
    nickname: "",
    description: "",
    price: 0,
  };

  const [formState, setFormState] = useState<DataItem>(initialState);
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [selectedFilament, setSelectedFilament] = useState<number | "">("");
  const [amountUsed, setAmountUsed] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (order) {
      setFormState(order);
    }
  }, [order]);

  useEffect(() => {
    fetchFilaments();
  }, []);

  const fetchFilaments = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.get(`${apiUrl}/filaments`);
      setFilaments(response.data);
    } catch (error) {
      console.error("Error fetching filaments:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormState((prevState) => ({
      ...prevState,
      [name as string]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name as string]: value,
    }));
  };

  const handleFilamentSelectChange = (
    event: SelectChangeEvent<number | "">
  ) => {
    setSelectedFilament(event.target.value as number | "");
  };

  const handleAmountUsedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountUsed(parseFloat(e.target.value) || "");
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedDescription = formState.description;

      if (
        formState.status !== statusOptions[0] &&
        selectedFilament &&
        amountUsed
      ) {
        const selectedFilamentData = filaments.find(
          (f) => f.id === selectedFilament
        );
        if (selectedFilamentData) {
          await axios.put(`${apiUrl}/filaments/${selectedFilament}`, {
            ...selectedFilamentData,
            amount_used: selectedFilamentData.amount_used + amountUsed,
          });

          updatedDescription += ` Filament used: ${selectedFilamentData.material}:${selectedFilamentData.colour_name}:${selectedFilamentData.size} (Weight) - ${amountUsed}`;
        }
      }

      const updatedFormState = {
        ...formState,
        description: updatedDescription,
      };

      if (updatedFormState.id === 0) {
        const response = await axios.post(`${apiUrl}/data`, updatedFormState);
        onSave({ ...updatedFormState, id: response.data.id });
      } else {
        await axios.put(
          `${apiUrl}/data/${updatedFormState.id}`,
          updatedFormState
        );
        onSave(updatedFormState);
      }
      setOpen(false);
      onCancel();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleDelete = async () => {
    try {
      onDelete(formState.id);
      setOpen(false);
      onCancel();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container sx={{ pb: 3 }}>
      <Typography variant="h4" gutterBottom>
        {formState.id === 0 ? "Add Order" : "Edit Order"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          flexWrap="wrap"
          gap={1}
        >
          <TextField
            fullWidth={isMobile}
            margin="dense"
            name="nickname"
            label="Nickname"
            value={formState.nickname}
            onChange={handleChange}
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          />
          <TextField
            fullWidth={isMobile}
            margin="dense"
            name="source_of_order"
            label="Source of Order"
            value={formState.source_of_order}
            onChange={handleChange}
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          />
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={1}
            sx={{ flex: "1 1 100%" }}
          >
            <TextField
              fullWidth={isMobile}
              margin="dense"
              name="size_x"
              label="Size X"
              type="number"
              value={formState.size_x}
              onChange={handleChange}
              sx={{ flex: "1 1 32%" }}
            />
            <TextField
              fullWidth={isMobile}
              margin="dense"
              name="size_y"
              label="Size Y"
              type="number"
              value={formState.size_y}
              onChange={handleChange}
              sx={{ flex: "1 1 32%" }}
            />
            <TextField
              fullWidth={isMobile}
              margin="dense"
              name="size_z"
              label="Size Z"
              type="number"
              value={formState.size_z}
              onChange={handleChange}
              sx={{ flex: "1 1 32%" }}
            />
          </Box>
          <FormControl
            fullWidth={isMobile}
            margin="dense"
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          >
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              name="color"
              value={formState.color}
              onChange={(e) =>
                handleSelectChange(
                  e as React.ChangeEvent<{ name?: string; value: unknown }>
                )
              }
              label="Color"
            >
              {colorOptions.map((color) => (
                <MenuItem key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth={isMobile}
            margin="dense"
            name="entry"
            label="Entry"
            value={formState.entry}
            onChange={handleChange}
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          />
          <FormControl
            fullWidth={isMobile}
            margin="dense"
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          >
            <InputLabel id="payment-label">Payment</InputLabel>
            <Select
              labelId="payment-label"
              name="payment"
              value={formState.payment}
              onChange={(e) =>
                handleSelectChange(
                  e as React.ChangeEvent<{ name?: string; value: unknown }>
                )
              }
              label="Payment"
            >
              {paymentOptions.map((method) => (
                <MenuItem key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.payment_received}
                onChange={handleChange}
                name="payment_received"
              />
            }
            label="Payment Received"
          />
          <TextField
            fullWidth={isMobile}
            margin="dense"
            name="discount"
            label="Discount"
            type="number"
            value={formState.discount}
            onChange={handleChange}
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          />
          <TextField
            fullWidth={isMobile}
            margin="dense"
            name="price"
            label="Price"
            type="number"
            value={formState.price}
            onChange={handleChange}
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          />
          <FormControl
            fullWidth={isMobile}
            margin="dense"
            sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formState.status}
              onChange={(e) =>
                handleSelectChange(
                  e as React.ChangeEvent<{ name?: string; value: unknown }>
                )
              }
              label="Status"
            >
              {statusOptions.map((status: string) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            name="description"
            label="Description"
            value={formState.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ flex: "1 1 100%" }}
          />
          {formState.status !== statusOptions[0] && (
            <>
              <FormControl
                fullWidth={isMobile}
                margin="dense"
                sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
              >
                <InputLabel id="filament-label">Filament</InputLabel>
                <Select
                  labelId="filament-label"
                  value={selectedFilament}
                  onChange={handleFilamentSelectChange}
                  label="Filament"
                >
                  {filaments.map((filament) => (
                    <MenuItem key={filament.id} value={filament.id}>
                      {`${filament.material}:${filament.colour_name}:${filament.size} (Weight) - ${filament.amount_used}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth={isMobile}
                margin="dense"
                name="amount_used"
                label="Amount Used"
                type="number"
                value={amountUsed}
                onChange={handleAmountUsedChange}
                sx={{ flex: isMobile ? "1 1 100%" : "1 1 48%" }}
              />
            </>
          )}
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              formState.status !== statusOptions[0] &&
              (!selectedFilament || !amountUsed)
            }
          >
            Save
          </Button>
          {formState.id !== 0 && (
            <Button variant="outlined" color="error" onClick={handleOpen}>
              Delete
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderForm;
