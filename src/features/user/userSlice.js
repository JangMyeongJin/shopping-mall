import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", {
        email,
        name,
        password,
      });
      const status = response.status;

      if(status === 200) {
        dispatch(showToastMessage({
          message: "Success for Sing up", 
          status: "success"
        }));
        navigate("/login");

        return response.data.data;
      }
      
    } catch (error) {
      const status = error.status;
      if(status === "fail") {
          dispatch(showToastMessage({
            message: error.message, 
            status: "error"
        }));
      } else {
        dispatch(showToastMessage({
          message: "Failure for Sing up", 
        status: "error"
        }));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {

    // pending 로딩중
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });

    // fulfilled 성공
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.registrationError = null;
    });

    // rejected 실패
    builder.addCase(registerUser.rejected, (state, action) => {
      state.registrationError = action.payload;
    });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
