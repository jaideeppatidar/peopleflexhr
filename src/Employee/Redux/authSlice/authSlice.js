import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('jwtToken'),
  user: JSON.parse(localStorage.getItem('User')) || { firstName: '', image: null, },
  token: localStorage.getItem('jwtToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('jwtToken', action.payload.token);
      localStorage.setItem('User', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = { firstName: '' };
      state.token = null;
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('User'); 
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('jwtToken', action.payload.token);
    },
    
      updateUserImage: (state, action) => {
        state.user.image = action.payload;
      },
    
  },
});

export const { loginSuccess, logout, refreshToken,updateUserImage } = authSlice.actions;
export default authSlice.reducer;
