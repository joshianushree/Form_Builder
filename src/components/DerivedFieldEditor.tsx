import React, { useState, useEffect } from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { Field } from "../types/form";

interface DerivedFieldEditorProps {
  allFields: Field[];
  currentFieldId: string;
  derived?: { parents: string[]; formula: string };
  onChange: (derived: { parents: string[]; formula: string } | undefined) => void;
}

const SUPPORTED_FUNCTIONS = ["sum", "average", "max", "min", "calculateAge"];

const DerivedFieldEditor: React.FC<DerivedFieldEditorProps> = ({
  allFields,
  currentFieldId,
  derived,
  onChange
}) => {
  const [isDerived, setIsDerived] = useState(!!derived);
  const [parents, setParents] = useState<string[]>(derived?.parents || []);
  const [formula, setFormula] = useState<string>(derived?.formula || "");
  const [error, setError] = useState<string | null>(null);

  // Validate formula and parents on changes
  useEffect(() => {
    if (!isDerived) {
      setError(null);
      onChange(undefined);
      return;
    }

    if (parents.length === 0) {
      setError("Please select at least one parent field.");
      onChange(undefined);
      return;
    }

    const match = formula.match(/^(\w+)\(\)$/);
    if (!match) {
      setError("Formula must be a function call without arguments, e.g. sum(), calculateAge()");
      onChange(undefined);
      return;
    }

    const funcName = match[1];
    if (!SUPPORTED_FUNCTIONS.includes(funcName)) {
      setError(`Unsupported function '${funcName}'. Supported: ${SUPPORTED_FUNCTIONS.join(", ")}`);
      onChange(undefined);
      return;
    }

    if (funcName === "calculateAge") {
      if (parents.length !== 1) {
        setError("calculateAge() requires exactly one parent field (e.g., a DOB field).");
        onChange(undefined);
        return;
      }
    } else {
      // For sum, average, max, min - parents should be numeric fields
      const nonNumericParents = parents.filter((pid) => {
        const f = allFields.find((f) => f.id === pid);
        if (!f) return true;
        return !(
          (f.type === "number") ||
          (typeof f.defaultValue === "number" || !isNaN(Number(f.defaultValue)))
        );
      });
      if (nonNumericParents.length > 0) {
        setError(
          `Selected parent fields contain non-numeric values, which are not valid for ${funcName}().`
        );
        onChange(undefined);
        return;
      }
    }

    setError(null);
    onChange({ parents, formula });
  }, [isDerived, parents, formula, onChange, allFields]);

  const [selectOpen, setSelectOpen] = useState(false);

  const handleParentChange = (e: any) => {
    const value = e.target.value;
    setParents(typeof value === "string" ? value.split(",") : value);
    setSelectOpen(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isDerived}
            onChange={(e) => setIsDerived(e.target.checked)}
          />
        }
        label="Mark as Derived Field"
      />

      {isDerived && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2">
            Select Parent Fields (cannot be this field itself):
          </Typography>
          <Select
            multiple
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            value={parents}
            onChange={handleParentChange}
            renderValue={(selected) =>
              (selected as string[])
                .map((id) => allFields.find((f) => f.id === id)?.label || id)
                .join(", ")
            }
          >
            {allFields
              .filter((f) => f.id !== currentFieldId)
              .map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label}
                </MenuItem>
              ))}
          </Select>

          <Typography variant="body2">
            Formula: Use functions like <code>sum()</code>, <code>average()</code>, <code>max()</code>, <code>min()</code>, or <code>calculateAge()</code>. <br />
            <strong>Note:</strong> All selected parent fields will be used automatically.
          </Typography>
          <TextField
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Example: sum() or calculateAge()"
            fullWidth
            error={!!error}
            helperText={error || " "}
          />
        </Box>
      )}
    </Box>
  );
};

export default DerivedFieldEditor;
