import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormSchema } from "../types/form";

interface FormsState {
  list: FormSchema[];
}

const initialState: FormsState = {
  list: [],
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setForms(state, action: PayloadAction<FormSchema[]>) {
      state.list = action.payload;
    },
    addForm(state, action: PayloadAction<FormSchema>) {
      state.list.push(action.payload);
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.list = state.list.filter(form => form.id !== action.payload);
    },
  },
});

export const { setForms, addForm, deleteForm } = formsSlice.actions;
export default formsSlice.reducer;
