import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface Colour {
  id: number;
  colour_name: string;
}

const ColourTable: React.FC = () => {
  const [colours, setColours] = useState<Colour[]>([]);
  const [newColour, setNewColour] = useState<string>("");
  const [editColourId, setEditColourId] = useState<number | null>(null);
  const [editColourName, setEditColourName] = useState<string>("");

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchColours();
  }, []);

  const fetchColours = async () => {
    try {
      const response = await axios.get(`${apiUrl}/colours`);
      setColours(response.data);
    } catch (error) {
      console.error("Error fetching colours:", error);
    }
  };

  const handleAddColour = async () => {
    try {
      const response = await axios.post(`${apiUrl}/colours`, {
        colour_name: newColour,
      });
      setColours([
        ...colours,
        { id: response.data.id, colour_name: newColour },
      ]);
      setNewColour("");
    } catch (error) {
      console.error("Error adding colour:", error);
    }
  };

  const handleEditColour = (id: number, name: string) => {
    setEditColourId(id);
    setEditColourName(name);
  };

  const handleUpdateColour = async (id: number) => {
    try {
      await axios.put(`${apiUrl}/colours/${id}`, {
        colour_name: editColourName,
      });
      setColours(
        colours.map((colour) =>
          colour.id === id ? { id, colour_name: editColourName } : colour
        )
      );
      setEditColourId(null);
      setEditColourName("");
    } catch (error) {
      console.error("Error updating colour:", error);
    }
  };

  const handleDeleteColour = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/colours/${id}`);
      setColours(colours.filter((colour) => colour.id !== id));
    } catch (error) {
      console.error("Error deleting colour:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Colour Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {colours.map((colour) => (
            <TableRow key={colour.id}>
              <TableCell>
                {editColourId === colour.id ? (
                  <TextField
                    value={editColourName}
                    onChange={(e) => setEditColourName(e.target.value)}
                  />
                ) : (
                  <Typography>{colour.colour_name}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editColourId === colour.id ? (
                  <Button onClick={() => handleUpdateColour(colour.id)}>
                    Save
                  </Button>
                ) : (
                  <IconButton
                    onClick={() =>
                      handleEditColour(colour.id, colour.colour_name)
                    }
                  >
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteColour(colour.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                label="New Colour"
                value={newColour}
                onChange={(e) => setNewColour(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button onClick={handleAddColour}>Add</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ColourTable;
