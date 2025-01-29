import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";

const initialState = {
  RESET(state) {
    state.isLoggedIn = false;
    state.user = null;
    state.users = [];
    state.twoFactor = false;
    state.isError = false;
    state.isLoading = false;
    state.message = "";
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state) {
      state.twoFactor = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state, action) => {
        state.isLoading = true;
    })
    .addCase(register.fulfilled, (state, action) =>{
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success('Registration successful')
    })
    .addCase(register.rejected, (state, action) =>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload);
    });
  },
});

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const { RESET } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const authReducer = authSlice.reducer;
