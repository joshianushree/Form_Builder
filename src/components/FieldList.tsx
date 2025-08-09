import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormGroup,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Field } from "../types/form";

interface Props {
  fields: Field[];
  onChange: (id: string, value: string | number | boolean | string[]) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FieldList: React.FC<Props> = ({
  fields,
  onEdit,
  onDelete,
  onChange,
  isPreview = false,
}) => {
  const [showPasswordIds, setShowPasswordIds] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation: required, email format, password strength
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = field.defaultValue;

      // Required validation
      if (field.validations?.required) {
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim() === "") ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "boolean" && val === false)
        ) {
          newErrors[field.id] = "This field is required";
          return; // skip other validations if required fails
        }
      }

      // Email validation for text fields
      if (field.type === "text" && field.validations?.email) {
        if (val && typeof val === "string" && !emailRegex.test(val)) {
          newErrors[field.id] = "Invalid email format";
        }
      }

      // Password validation for text fields
      if (field.type === "text" && field.validations?.password) {
        if (val && typeof val === "string") {
          if (val.length < 8) {
            newErrors[field.id] = "Password must be at least 8 characters";
          } else if (!/\d/.test(val)) {
            newErrors[field.id] = "Password must contain at least one number";
          }
        }
      }
    });
    setErrors(newErrors);
  }, [fields]);

  if (fields.length === 0) {
    return <Typography>No fields added yet</Typography>;
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderInput = (field: Field) => {
    const value = field.defaultValue ?? "";
    const errorMsg = errors[field.id];
    const isError = Boolean(errorMsg);

    // Password input with visibility toggle
    if (field.type === "text" && field.validations?.password) {
      return (
        <TextField
          type={showPasswordIds[field.id] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          fullWidth
          size="small"
          error={isError}
          helperText={errorMsg}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility(field.id)}
                  edge="end"
                  size="small"
                  aria-label="toggle password visibility"
                >
                  {showPasswordIds[field.id] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );
    }

    // Email input with validation error
    if (field.type === "text" && field.validations?.email) {
      return (
        <TextField
          type="text"
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          fullWidth
          size="small"
          error={isError}
          helperText={errorMsg}
        />
      );
    }

    // Other field types
    switch (field.type) {
      case "text":
        return (
          <TextField
            type="text"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            fullWidth
            size="small"
            error={isError}
            helperText={errorMsg}
          />
        );

      case "date":
        return (
          <TextField
            type="date"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            fullWidth
            size="small"
            error={isError}
            helperText={errorMsg}
          />
        );

      case "number":
        return (
          <TextField
            type="number"
            value={value !== undefined && value !== null ? String(value) : ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                onChange(field.id, "");
                return;
              }
              const parsed = Number(val);
              onChange(field.id, isNaN(parsed) ? "" : parsed);
            }}
            fullWidth
            size="small"
            error={isError}
            helperText={errorMsg}
          />
        );

      case "textarea":
        return (
          <TextField
            multiline
            rows={3}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            fullWidth
            size="small"
            error={isError}
            helperText={errorMsg}
          />
        );

      case "checkbox":
        if (field.options && field.options.length > 0) {
          const selectedValues: string[] = Array.isArray(value) ? value : [];

          const handleCheckboxChange = (option: string, checked: boolean) => {
            const newSelected = checked
              ? [...selectedValues, option]
              : selectedValues.filter((v) => v !== option);
            onChange(field.id, newSelected);
          };

          return (
            <FormGroup>
              {field.options.map((opt) => (
                <FormControlLabel
                  key={opt}
                  control={
                    <Checkbox
                      checked={selectedValues.includes(opt)}
                      onChange={(e) => handleCheckboxChange(opt, e.target.checked)}
                    />
                  }
                  label={opt}
                />
              ))}
              {isError && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                  {errorMsg}
                </Typography>
              )}
            </FormGroup>
          );
        } else {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.id, e.target.checked)}
                />
              }
              label={field.label || "Checkbox"}
            />
          );
        }

      case "radio":
        return (
          <>
            <RadioGroup
              row
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
            >
              {(field.options || []).map((opt) => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={<Radio size="small" />}
                  label={opt}
                />
              ))}
            </RadioGroup>
            {isError && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {errorMsg}
              </Typography>
            )}
          </>
        );

      case "select":
        return (
          <>
            <Select
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
              size="small"
              fullWidth
              error={isError}
            >
              {(field.options || []).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            {isError && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {errorMsg}
              </Typography>
            )}
          </>
        );

      default:
        return <Typography>Unsupported field type: {field.type}</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map((field) => (
        <Box
          key={field.id}
          sx={{
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {field.label || <i style={{ color: "#999" }}>No label</i>}{" "}
              {isPreview && field.validations?.required && (
                <span style={{ color: "red", fontWeight: "bold", marginLeft: 4 }}>
                  *
                </span>
              )}
              {!isPreview && field.derived && (
                <span style={{ color: "#1976d2", fontWeight: "bold" }}>[Derived]</span>
              )}
            </Typography>
            {renderInput(field)}
          </Box>

          {!isPreview && onEdit && onDelete && (
            <>
              <IconButton onClick={() => onEdit(field.id)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(field.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default FieldList;
