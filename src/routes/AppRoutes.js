import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../views/LoginPage';
import { RegisterPage } from '../views/RegisterPage';
import { HomePage } from '../views/HomePage';
import { ClientesListPage } from '../views/ClientesListPage';
import { ClienteFormPage } from '../views/ClienteFormPage';
import { NotFoundPage } from '../views/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clientes" element={<ClientesListPage />} />
        <Route path="/clientes/nuevo" element={<ClienteFormPage mode="create" />} />
        <Route path="/clientes/:id" element={<ClienteFormPage mode="edit" />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

