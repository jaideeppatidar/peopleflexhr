import axios from "axios";

const API = axios.create({
  
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);


// Admin Login Services
export const loginAdmin = async (credentials) => {
    try {
      const response = await API.post("/admin", credentials);
      const { jwtToken } = response.data;
      if (jwtToken) {
        return { jwtToken }; 
      }
    } catch (error) {
      throw error; 
    }
  };