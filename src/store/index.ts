import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import formsReducer from "./formsSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
