import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  addField,
  deleteField,
  resetForm,
  updateField,
  reorderFields,
} from "../store/formSlice";
import { saveForm } from "../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FormSchema, FieldType, Field } from "../types/form";
import FieldEditor from "../components/FieldEditor";

// Allowed field types to add to the form
const fieldTypes: FieldType[] = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
];

/**
 * Validates derived fields to ensure their parents and formulas are compatible.
 * For example, sum/avg require numeric parent fields,
 * calculateAge requires exactly one date-type parent.
 */
const validateDerivedField = (
  field: Field,
  fieldsById: Record<string, Field>
): { valid: boolean; error?: string } => {
  if (!field.derived) return { valid: true };

  const parents = field.derived.parents
    .map((pid) => fieldsById[pid])
    .filter(Boolean);
  const formula = field.derived.formula.trim().toLowerCase();

  if (["sum", "average", "avg", "min", "max"].some((f) => formula.startsWith(f))) {
    // All parents must be numbers for these formulas
    const nonNumeric = parents.filter((p) => p.type !== "number");
    if (nonNumeric.length > 0) {
      return {
        valid: false,
        error: `Formula "${formula}" requires all parent fields to be numeric.`,
      };
    }
  } else if (formula.startsWith("calculateage")) {
    // calculateAge requires exactly one parent of type date
    if (parents.length !== 1) {
      return { valid: false, error: "calculateAge requires exactly one parent field." };
    }
    if (parents[0].type !== "date") {
      return { valid: false, error: "calculateAge's parent field must be of type date." };
    }
  }

  // Additional formula validations can be added here

  return { valid: true };
};

const CreateForm = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state: RootState) => state.form.fields);

  // State to hold the selected new field type before adding
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");

  // State to hold the form name input by the user
  const [formName, setFormName] = useState("");

  // Control visibility of the field editor dialog
  const [editorOpen, setEditorOpen] = useState(false);

  // The currently selected field for editing (existing or new)
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  // Temporary holder for a newly added field before it is saved to Redux
  const [tempNewField, setTempNewField] = useState<Field | null>(null);

  // Create a quick lookup dictionary for fields by their ID
  const fieldsById = fields.reduce<Record<string, Field>>((acc, f) => {
    acc[f.id] = f;
    return acc;
  }, {});

  // Called when the user clicks "Add Field"
  // Creates a new empty field and opens the editor dialog
  const handleAddField = () => {
    const newField: Field = {
      id: uuidv4(),
      type: newFieldType,
      label: "",
      defaultValue: "",
      validations: {},
    };
    setTempNewField(newField);
    setSelectedField(newField);
    setEditorOpen(true);
  };

  // Called when user saves the form
  // Validates form name and derived fields before saving to localStorage
  const handleSaveForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field to the form");
      return;
    }

    // Validate all derived fields to ensure correct parents & formulas
    for (const field of fields) {
      const { valid, error } = validateDerivedField(field, fieldsById);
      if (!valid) {
        alert(`Error in field "${field.label || "No label"}": ${error}`);
        return;
      }
    }

    // Build form schema object and save it
    const formSchema: FormSchema = {
      id: uuidv4(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields,
    };
    saveForm(formSchema);

    // Reset Redux form state and clear form name input
    dispatch(resetForm());
    setFormName("");
    alert("Form saved!");
  };

  // Open editor dialog for an existing field
  const handleEditClick = (field: Field) => {
    setSelectedField(field);
    setEditorOpen(true);
  };

  // Handle saving a field from the editor dialog
  // Adds new field or updates existing one accordingly
  const handleSaveField = (updated: Field) => {
    if (tempNewField && updated.id === tempNewField.id) {
      dispatch(addField(updated));
      setTempNewField(null);
    } else {
      dispatch(updateField(updated));
    }
    setEditorOpen(false);
    setSelectedField(null);
  };

  // Cancel field editing, discard any new unsaved field
  const handleCancel = () => {
    setTempNewField(null);
    setSelectedField(null);
    setEditorOpen(false);
  };

  // Reorder fields up or down in the list
  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    dispatch(reorderFields({ fromIndex: index, toIndex: newIndex }));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Form
      </Typography>

      {/* Input for the form name */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Controls to select field type and add new field */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value as FieldType)}
        >
          {fieldTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleAddField}>
          Add Field
        </Button>
      </Box>

      {/* List of existing fields with reorder and delete buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {fields.map((field, index) => (
          <Paper
            key={field.id}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => handleEditClick(field)}
          >
            <Typography sx={{ flexGrow: 1 }}>
              {field.label || <i style={{ color: "#999" }}>No label</i>} ({field.type})
              {field.derived && (
                <Typography component="span" color="primary" sx={{ ml: 1 }}>
                  [Derived]
                </Typography>
              )}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                size="small"
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  moveField(index, "up");
                }}
                title="Move Up"
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={index === fields.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  moveField(index, "down");
                }}
                title="Move Down"
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteField(field.id));
                }}
                title="Delete Field"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Button to save the entire form */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleSaveForm}>
          Save Form
        </Button>
      </Box>

      {/* Field editor modal for adding or editing fields */}
      <FieldEditor
        open={editorOpen}
        field={selectedField}
        onSave={handleSaveField}
        onClose={handleCancel}
      />
    </Container>
  );
};

export default CreateForm;
