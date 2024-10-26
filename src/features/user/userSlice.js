import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      if(response.status === 200) {
        sessionStorage.setItem("token", response.data.token);   // session에 token 저장
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;  // headers에 token 저장, Bearer는 토큰에 붙여주는 규칙(?)

        return response.data;
      }

    } catch (error) {

      // error.[key] 로 접근 가능 (error.response는 접근 불가)
      return rejectWithValue(error.message);
    }
  }
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
    
    builder
    .addCase(registerUser.pending, (state) => {
      // 회원가입 pending
      state.loading = true;

    })
    .addCase(registerUser.fulfilled, (state) => {
      // 회원가입 fulfilled
      state.loading = false;
      state.registrationError = null;

    })
    .addCase(registerUser.rejected, (state, action) => {
      // 회원가입 rejected
      state.registrationError = action.payload;

    })
    .addCase(loginWithEmail.pending, (state) => {
      // 로그인 pending
      state.loading = true;

    })
    .addCase(loginWithEmail.fulfilled, (state, action) => {
      // 로그인 fulfilled
      state.loading = false;
      state.user = action.payload.user;
      state.loginError = null;

    })
    .addCase(loginWithEmail.rejected, (state, action) => {
      // 로그인 rejected
      state.loginError = action.payload;
      state.loading = false;
      state.user = null;

    });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
