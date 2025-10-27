import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🌍 Auto-detect API URL for both local & production
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production"
    ? "https://fitora-backend.onrender.com" // 🔗 Your Render backend URL
    : "http://localhost:5000");              // 💻 Local backend

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// 🧩 REGISTER USER
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

// 🔐 LOGIN USER
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

// 🚪 LOGOUT USER
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    `${API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

// ✅ CHECK AUTHENTICATION STATUS
export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await axios.get(`${API_URL}/api/auth/check-auth`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
