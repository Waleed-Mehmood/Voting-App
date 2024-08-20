// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Correct import path

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useUser();
  // console.log('isLoggedIn:', isLoggedIn);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
