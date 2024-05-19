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
  MenuItem,
  Select,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface Filament {
  id: number;
  size: number;
  amount_used: number;
  date_of_addition: string;
  material: string;
  colour_name: string;
}

interface Colour {
  id: number;
  colour_name: string;
}

const FilamentTable: React.FC = () => {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [colours, setColours] = useState<Colour[]>([]);
  const [newFilament, setNewFilament] = useState<Partial<Filament>>({});
  const [editFilamentId, setEditFilamentId] = useState<number | null>(null);
  const [editFilament, setEditFilament] = useState<Partial<Filament>>({});

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFilaments();
    fetchColours();
    setNewFilament({
      ...newFilament,
      amount_used: 0,
      date_of_addition: new Date().toISOString().split("T")[0],
    });
  }, []);

  const fetchFilaments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/filaments`);
      setFilaments(response.data);
    } catch (error) {
      console.error("Error fetching filaments:", error);
    }
  };

  const fetchColours = async () => {
    try {
      const response = await axios.get(`${apiUrl}/colours`);
      setColours(response.data);
    } catch (error) {
      console.error("Error fetching colours:", error);
    }
  };

  const handleAddFilament = async () => {
    try {
      const response = await axios.post(`${apiUrl}/filaments`, newFilament);
      setFilaments([
        ...filaments,
        { ...newFilament, id: response.data.id } as Filament,
      ]);
      setNewFilament({});
    } catch (error) {
      console.error("Error adding filament:", error);
    }
  };

  const handleEditFilament = (filament: Filament) => {
    setEditFilamentId(filament.id);
    setEditFilament(filament);
  };

  const handleUpdateFilament = async (id: number) => {
    try {
      await axios.put(`${apiUrl}/filaments/${id}`, editFilament);
      setFilaments(
        filaments.map((filament) =>
          filament.id === id ? (editFilament as Filament) : filament
        )
      );
      setEditFilamentId(null);
      setEditFilament({});
    } catch (error) {
      console.error("Error updating filament:", error);
    }
  };

  const handleDeleteFilament = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/filaments/${id}`);
      fetchFilaments();
    } catch (error) {
      console.error("Error deleting filament:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Size</TableCell>
            <TableCell>Amount Used</TableCell>
            <TableCell>Date of Addition</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Colour</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filaments.map((filament) => (
            <TableRow key={filament.id}>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <TextField
                    value={editFilament.size}
                    onChange={(e) =>
                      setEditFilament({
                        ...editFilament,
                        size: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <Typography>{filament.size}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <TextField
                    value={editFilament.amount_used}
                    onChange={(e) =>
                      setEditFilament({
                        ...editFilament,
                        amount_used: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  <Typography>{filament.amount_used}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <TextField
                    type="date"
                    value={editFilament.date_of_addition}
                    onChange={(e) =>
                      setEditFilament({
                        ...editFilament,
                        date_of_addition: e.target.value,
                      })
                    }
                  />
                ) : (
                  <Typography>{filament.date_of_addition}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <TextField
                    value={editFilament.material}
                    onChange={(e) =>
                      setEditFilament({
                        ...editFilament,
                        material: e.target.value,
                      })
                    }
                  />
                ) : (
                  <Typography>{filament.material}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <Select
                    value={editFilament.colour_name}
                    onChange={(e) =>
                      setEditFilament({
                        ...editFilament,
                        colour_name: e.target.value as string,
                      })
                    }
                  >
                    {colours.map((colour) => (
                      <MenuItem key={colour.id} value={colour.colour_name}>
                        {colour.colour_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography>{filament.colour_name}</Typography>
                )}
              </TableCell>
              <TableCell>
                {editFilamentId === filament.id ? (
                  <Button onClick={() => handleUpdateFilament(filament.id)}>
                    Save
                  </Button>
                ) : (
                  <IconButton onClick={() => handleEditFilament(filament)}>
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteFilament(filament.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                label="New Size"
                value={newFilament.size || ""}
                onChange={(e) =>
                  setNewFilament({
                    ...newFilament,
                    size: parseFloat(e.target.value),
                  })
                }
              />
            </TableCell>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <TextField
                label="New Material"
                value={newFilament.material || ""}
                onChange={(e) =>
                  setNewFilament({ ...newFilament, material: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Select
                value={newFilament.colour_name || ""}
                onChange={(e) =>
                  setNewFilament({
                    ...newFilament,
                    colour_name: e.target.value as string,
                  })
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Colour
                </MenuItem>
                {colours.map((colour) => (
                  <MenuItem key={colour.id} value={colour.colour_name}>
                    {colour.colour_name}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              <Button onClick={handleAddFilament}>Add</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilamentTable;
