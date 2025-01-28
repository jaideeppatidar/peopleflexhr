// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// const PrivateRoute = ({ element }) => {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated) || localStorage.getItem("jwtToken");
//     return isAuthenticated ? element : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element }) => {
  // Use the Redux state to check for authentication
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If not authenticated, redirect to the login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
