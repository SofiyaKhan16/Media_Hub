import { createSlice } from '@reduxjs/toolkit';
import { removeCookie } from '../api/cookies';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log(action);
      state.user = action.payload;
    },
    clearUser: (state) => {
      removeCookie()
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
