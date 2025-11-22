import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
}

const initialState: AuthState = {
  email: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetAuthState: (state) => {
      state.email = null;
    },
  },
});

export const { setEmail, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
