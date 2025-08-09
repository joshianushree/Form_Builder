// src/components/FormNameDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const FormNameDialog: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField
          label="Form Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (name.trim()) {
              onSave(name.trim());
              setName("");
            }
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormNameDialog;
