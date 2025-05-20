import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/auth/Dashboard';
import PrivateRoute from './features/auth/PrivateRoute';
import Products from './features/products/Products';


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/dashboard/products',
    element: (
      <PrivateRoute>
        <Products />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "/users",
  //   element: (
  //     <PrivateRoute>
  //       <Users />
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

