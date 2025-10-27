import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

// ✅ Fetch all orders for admin
export const getAllOrdersForAdmin = createAsyncThunk(
  "/admin/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`
    );
    return response.data;
  }
);

// ✅ Fetch specific order details
export const getOrderDetailsForAdmin = createAsyncThunk(
  "/admin/getOrderDetailsForAdmin",
  async (orderId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/${orderId}`
    );
    return response.data;
  }
);

// ✅ Update order status (the missing function)
export const updateOrderStatus = createAsyncThunk(
  "/admin/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/order/update/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })

      // ✅ update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        const index = state.orderList.findIndex(
          (o) => o._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminOrderSlice.reducer;
