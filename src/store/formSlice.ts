import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Field } from "../types/form";

interface FormState {
  fields: Field[];
}

const initialState: FormState = {
  fields: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField(state, action: PayloadAction<Field>) {
      state.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<Field>) {
      const index = state.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.fields[index] = action.payload;
    },
    deleteField(state, action: PayloadAction<string>) {
      const idToDelete = action.payload;
      state.fields = state.fields.filter(f => f.id !== idToDelete);
      state.fields = state.fields.map(f => {
        if (f.derived) {
          return {
            ...f,
            derived: {
              ...f.derived,
              parents: f.derived.parents.filter(p => p !== idToDelete),
            },
          };
        }
        return f;
      });
    },
    reorderFields(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      const fields = [...state.fields];
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= fields.length ||
        toIndex >= fields.length
      ) return;
      const [moved] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, moved);
      state.fields = fields;
    },
    resetForm(state) {
      state.fields = [];
    },
  },
});

export const { addField, updateField, deleteField, reorderFields, resetForm } = formSlice.actions;
export default formSlice.reducer;
