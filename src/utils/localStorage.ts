import { FormSchema } from "../types/form";

const STORAGE_KEY = "forms";

export const saveForm = (form: FormSchema): void => {
  try {
    const forms = getForms();
    const existingIndex = forms.findIndex((f) => f.id === form.id);
    if (existingIndex !== -1) {
      forms[existingIndex] = form;
    } else {
      forms.push(form);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error("Failed to save form:", error);
  }
};

export const getForms = (): FormSchema[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse forms from localStorage:", error);
    return [];
  }
};

export const deleteFormFromStorage = (id: string): void => {
  try {
    const forms = getForms().filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error("Failed to delete form:", error);
  }
};

export const getFormById = (id: string): FormSchema | undefined => {
  try {
    const forms = getForms();
    return forms.find((f) => f.id === id);
  } catch (error) {
    console.error("Failed to get form by id:", error);
    return undefined;
  }
};
