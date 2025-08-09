import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import { Field } from "../types/form";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DerivedFieldEditor from "./DerivedFieldEditor";

interface FieldEditorProps {
  open: boolean;
  field: Field | null;
  onSave: (updated: Field) => void;
  onClose: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  open,
  field,
  onSave,
  onClose,
}) => {
  const allFields = useSelector((state: RootState) => state.form.fields);

  const [label, setLabel] = useState("");
  const [defaultValue, setDefaultValue] = useState<string | number | boolean | string[]>("");
  const [required, setRequired] = useState(false);
  const [minLength, setMinLength] = useState<number | undefined>(undefined);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [options, setOptions] = useState<string>("");
  const [derived, setDerived] = useState<Field["derived"]>();

  useEffect(() => {
    if (field) {
      setLabel(field.label);
      setDefaultValue(field.defaultValue ?? "");
      setRequired(field.validations?.required ?? false);
      setMinLength(field.validations?.minLength);
      setMaxLength(field.validations?.maxLength);
      setEmail(field.validations?.email ?? false);
      setPassword(field.validations?.password ?? false);
      setOptions(field.options?.join(",") ?? "");
      setDerived(field.derived);
    }
  }, [field]);

  if (!field) return null;

  // Handle defaultValue input based on field type
  const handleDefaultValueChange = (val: string) => {
    if (field.type === "number") {
      const parsed = parseFloat(val);
      setDefaultValue(isNaN(parsed) ? "" : parsed);
    } else if (field.type === "checkbox") {
      if (field.options && field.options.length > 0) {
        // Multi-checkbox defaultValue as string array
        const arr = val.split(",").map((v) => v.trim()).filter(Boolean);
        setDefaultValue(arr);
      } else {
        // Single checkbox boolean value
        if (val.toLowerCase() === "true") setDefaultValue(true);
        else if (val.toLowerCase() === "false") setDefaultValue(false);
        else setDefaultValue(val);
      }
    } else {
      setDefaultValue(val);
    }
  };

  const handleSave = () => {
    if (!label.trim()) {
      alert("Label cannot be empty");
      return;
    }
    if (minLength !== undefined && minLength < 0) {
      alert("Min Length cannot be negative");
      return;
    }
    if (maxLength !== undefined && maxLength < 0) {
      alert("Max Length cannot be negative");
      return;
    }
    if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
      alert("Min Length cannot be greater than Max Length");
      return;
    }

    onSave({
      ...field,
      label: label.trim(),
      defaultValue,
      validations: {
        ...field.validations,
        required,
        minLength,
        maxLength,
        email,
        password,
      },
      options:
        field.type === "select" ||
        field.type === "radio" ||
        field.type === "checkbox"
          ? options
              .split(",")
              .map((o) => o.trim())
              .filter((o) => o.length > 0)
          : undefined,
      derived,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Field</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
          fullWidth
        />
        <TextField
          label="Default Value"
          value={
            Array.isArray(defaultValue)
              ? defaultValue.join(", ")
              : typeof defaultValue === "boolean"
              ? defaultValue.toString()
              : defaultValue
          }
          onChange={(e) => handleDefaultValueChange(e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="Required (Not Empty)"
        />
        <TextField
          label="Min Length"
          type="number"
          value={minLength ?? ""}
          onChange={(e) =>
            setMinLength(e.target.value ? parseInt(e.target.value) : undefined)
          }
          fullWidth
        />
        <TextField
          label="Max Length"
          type="number"
          value={maxLength ?? ""}
          onChange={(e) =>
            setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)
          }
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox checked={email} onChange={(e) => setEmail(e.target.checked)} />
          }
          label="Email Format"
        />
        <FormControlLabel
          control={
            <Checkbox checked={password} onChange={(e) => setPassword(e.target.checked)} />
          }
          label="Password Rule (min 8 chars, must contain a number)"
        />

        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Options (comma separated)
            </Typography>
            <TextField fullWidth value={options} onChange={(e) => setOptions(e.target.value)} />
          </Box>
        )}

        {/* Derived Field Editor */}
        <DerivedFieldEditor
          allFields={allFields}
          currentFieldId={field.id}
          derived={derived}
          onChange={setDerived}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;
