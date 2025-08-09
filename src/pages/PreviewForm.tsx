import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Field, FormSchema } from "../types/form";
import FieldList from "../components/FieldList";
import { getFormById } from "../utils/localStorage";
import { evaluateFormula } from "../utils/formulas";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PreviewForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id");
  const navigate = useNavigate();

  const [fields, setFields] = useState<Field[]>([]);
  const [formName, setFormName] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fieldsChanged = (oldFields: Field[], newFields: Field[]) => {
    if (oldFields.length !== newFields.length) return true;
    for (let i = 0; i < oldFields.length; i++) {
      if (oldFields[i].defaultValue !== newFields[i].defaultValue) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (formId) {
      const savedForm: FormSchema | undefined = getFormById(formId);
      if (savedForm) {
        setFormName(savedForm.name);
        setFields(savedForm.fields);
      }
    }
  }, [formId]);

  useEffect(() => {
    // Recalculate derived fields
    const currentValues: Record<string, any> = {};
    fields.forEach((f) => {
      currentValues[f.id] = f.defaultValue;
    });

    const newFields = fields.map((field) => {
      if (field.derived) {
        const newValue = evaluateFormula(
          field.derived.formula,
          field.derived.parents,
          currentValues
        );
        if (field.defaultValue !== newValue) {
          return { ...field, defaultValue: newValue };
        }
      }
      return field;
    });

    if (fieldsChanged(fields, newFields)) {
      setFields(newFields);
    }
  }, [fields]);

  // Validation logic
  const validateFields = (fields: Field[]) => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = field.defaultValue;

      if (field.validations?.required) {
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim() === "") ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "boolean" && val === false)
        ) {
          errors[field.id] = "This field is required";
          return;
        }
      }

      if (field.type === "text" && field.validations?.email) {
        if (val && typeof val === "string" && !emailRegex.test(val)) {
          errors[field.id] = "Invalid email format";
          return;
        }
      }

      if (field.type === "text" && field.validations?.password) {
        if (val && typeof val === "string") {
          if (val.length < 8) {
            errors[field.id] = "Password must be at least 8 characters";
            return;
          } else if (!/\d/.test(val)) {
            errors[field.id] = "Password must contain at least one number";
            return;
          }
        }
      }
    });
    return errors;
  };

  useEffect(() => {
    const errors = validateFields(fields);
    setFormErrors(errors);
  }, [fields]);

  const handleFieldValueChange = (id: string, value: any) => {
    setFields((prevFields) =>
      prevFields.map((f) => (f.id === id ? { ...f, defaultValue: value } : f))
    );
  };

  const handleSubmit = () => {
    if (Object.keys(formErrors).length > 0) {
      alert("Please fix validation errors before submitting the form.");
      return;
    }
    alert("Form submitted! Check console for values.");
    navigate("/myforms");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {formName || "Untitled Form"}
      </Typography>

      {fields.length === 0 ? (
        <Typography>No fields to display.</Typography>
      ) : (
        <FieldList
          fields={fields}
          onChange={handleFieldValueChange}
          isPreview={true}
        />
      )}

      {fields.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(formErrors).length > 0}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => navigate("/myforms")}
          >
            Back to My Forms
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default PreviewForm;
