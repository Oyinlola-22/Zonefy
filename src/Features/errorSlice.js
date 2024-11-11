import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errors: [], //{ message: "", type: "" }
};

const errorSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setError: (state, actions) => {
      state.errors = [
        ...state.errors,
        { message: actions.payload, type: "error" },
      ];
    },

    setSuccess: (state, actions) => {
      state.errors = [
        ...state.errors,
        { message: actions.payload, type: "success" },
      ];
    },

    clearErrors: (state) => {
      state.errors = [];
    },

    clearError: (state, actions) => {
      const filteredEntries = state.errors.filter(
        (e) => e.message !== actions.payload
      );
      state.errors = [...filteredEntries];
    },
  },
});

export const { setError, clearError, clearErrors, setSuccess } =
  errorSlice.actions;
export default errorSlice.reducer;
