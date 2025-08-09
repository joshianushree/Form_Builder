import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/create")}
        >
          Form Builder
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" onClick={() => navigate("/create")}>
            Create
          </Button>
          <Button color="inherit" onClick={() => navigate("/myforms")}>
            My Forms
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
