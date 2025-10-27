import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🌍 API URL for both local and production
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production"
    ? "https://fitora-backend.onrender.com"
    : "http://localhost:5000");

// 🔄 Thunks

// 1️⃣ Fetch all orders (admin)
export const getAllOrdersForAdmin = createAsyncThunk(
  "admin/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        withCredentials: true,
      });
      return response.data.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2️⃣ Fetch single order details (admin)
export const getOrderDetailsForAdmin = createAsyncThunk(
  "admin/getOrderDetailsForAdmin",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/${orderId}`, {
        withCredentials: true,
      });
      return response.data.order || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3️⃣ Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${orderId}`,
        { status },
        { withCredentials: true }
      );
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔧 Initial state
const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
};

// 🧩 Slice
const orderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;

        // Update in orders list
        state.orders = state.orders.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        );

        // Update details if same
        if (state.orderDetails && state.orderDetails._id === updatedOrder._id) {
          state.orderDetails = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions & reducer
export const { resetOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
