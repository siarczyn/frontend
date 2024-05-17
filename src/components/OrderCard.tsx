// OrderCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { Done, Clear, Edit } from "@mui/icons-material";
import { format } from "date-fns";
import { DataItem } from "../types";

interface OrderCardProps {
  item: DataItem;
  onEdit: (order: DataItem) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ item, onEdit }) => {
  return (
    <Card sx={{ mb: 2, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order #{item.id}
        </Typography>
        <Typography variant="body1">
          <strong>Date of Order:</strong>{" "}
          {format(new Date(item.date_of_order), "dd-MM-yyyy")}
        </Typography>
        <Typography variant="body1">
          <strong>Nickname:</strong> {item.nickname}
        </Typography>
        <Typography variant="body1">
          <strong>Color:</strong> {item.color}
        </Typography>
        <Typography variant="body1">
          <strong>Size:</strong> {item.size_x} x {item.size_y} x {item.size_z}
        </Typography>
        <Typography variant="body1">
          <strong>Entry:</strong> {item.entry}
        </Typography>
        <Typography variant="body1">
          <strong>Price:</strong> {item.price}
        </Typography>
        <Typography variant="body1">
          <strong>Order Source:</strong> {item.source_of_order}
        </Typography>
        <Typography variant="body1">
          <strong>Payment:</strong> {item.payment}
        </Typography>
        <Typography variant="body1">
          <strong>Finished:</strong>{" "}
          {item.finished ? (
            <Done color="primary" />
          ) : (
            <Clear color="secondary" />
          )}
        </Typography>
        <Typography variant="body1">
          <strong>Payment Received:</strong>{" "}
          {item.payment_received ? (
            <Done color="primary" />
          ) : (
            <Clear color="secondary" />
          )}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {item.description}
        </Typography>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          mt={2}
        >
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(item)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
