import React, { useEffect, useState } from "react";
import { getForms, deleteFormFromStorage } from "../utils/localStorage";
import { FormSchema } from "../types/form";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Link
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const MyForms = () => {
  // State to hold all saved forms loaded from localStorage
  const [forms, setForms] = useState<FormSchema[]>([]);

  // Hook from react-router-dom for navigation between routes
  const navigate = useNavigate();

  // On component mount, load forms from localStorage
  useEffect(() => {
    setForms(getForms());
  }, []);

  // Navigate to preview page for the selected form
  const handlePreview = (id: string) => {
    navigate(`/preview?id=${id}`);
  };

  // Delete a form from localStorage and update the state
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      deleteFormFromStorage(id);
      setForms(getForms());
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Forms
      </Typography>

      {/* Show message if no forms saved yet */}
      {forms.length === 0 ? (
        <Typography>No forms saved yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* List all saved forms */}
          {forms.map((form) => (
            <Paper
              key={form.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box>
                {/* Form name as clickable link to preview */}
                <Link
                  component="button"
                  variant="h6"
                  onClick={() => handlePreview(form.id)}
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {form.name}
                </Link>
                {/* Display form creation date */}
                <Typography variant="body2" color="textSecondary">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Delete button for the form */}
              <IconButton
                color="error"
                onClick={() => handleDelete(form.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyForms;
