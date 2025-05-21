import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import TaskList from "./components/Tasks/TaskList";
import TaskDetails from "./components/Tasks/TaskDetails";
import TaskForm from "./components/Tasks/TaskForm";
import EditTask from "./components/Tasks/EditTask";
import Navbar from "./components/Navbar";
import AdminPanel from "./components/Admin/AdminPanel";
import Unauthorized from "./components/Unauthorized";


const PrivateRoute = ({ children, roles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // If roles are specified, check if the user's role is allowed
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};


const AppRoutes = () => (
  <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PrivateRoute roles={["admin"]}>
            <Register />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/tasks/new"
        element={
          <PrivateRoute roles={["admin"]}>
            <TaskForm />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <TaskDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <PrivateRoute roles={["admin"]}>
            <EditTask />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminPanel />
          </PrivateRoute>
        }
      />
   
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
