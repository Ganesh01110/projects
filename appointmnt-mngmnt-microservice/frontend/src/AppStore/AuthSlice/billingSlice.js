import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SummaryApi from "../../common/index";

// 🔹 Create Bill
export const createBill = createAsyncThunk(
  "billing/createBill",
  async ({ patientId, amount, description }, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.Billing.createBill.url, {
        method: SummaryApi.Billing.createBill.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, amount, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bill");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Mark Bill as Paid
export const payBill = createAsyncThunk(
  "billing/payBill",
  async (billId, { rejectWithValue }) => {
    try {
      const url = SummaryApi.Billing.payBill.url.replace(":id", billId);
      const response = await fetch(url, {
        method: SummaryApi.Billing.payBill.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to mark bill as paid");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get All Bills
export const getAllBills = createAsyncThunk(
  "billing/getAllBills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(SummaryApi.Billing.getAllBills.url, {
        method: SummaryApi.Billing.getAllBills.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Get Bills by Patient ID
export const getBillsByPatientId = createAsyncThunk(
  "billing/getBillsByPatientId",
  async (patientId, { rejectWithValue }) => {
    try {
      const url = SummaryApi.Billing.getBillsByPatientId.url.replace(":patientId", patientId);
      const response = await fetch(url, {
        method: SummaryApi.Billing.getBillsByPatientId.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient bills");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🔹 Billing Slice
const billingSlice = createSlice({
  name: "billing",
  initialState: {
    patientBills:[],
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Bill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pay Bill
      .addCase(payBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(payBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.map((bill) =>
          bill.id === action.payload.id ? action.payload : bill
        );
      })
      .addCase(payBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Bills
      .addCase(getAllBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getAllBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Bills by Patient ID
      .addCase(getBillsByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBillsByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.patientBills = action.payload;
      })
      .addCase(getBillsByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default billingSlice.reducer;
