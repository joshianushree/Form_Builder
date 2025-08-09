import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateForm from "../pages/CreateForm";   // Form builder/design page
import PreviewForm from "../pages/PreviewForm"; // Preview and fill form (end user view)
import MyForms from "../pages/MyForms";         // List saved forms

const AppRoutes = () => (
  <Routes>
    {/* Redirect root "/" to "/create" for convenience */}
    <Route path="/" element={<Navigate to="/create" replace />} />

    {/* Route for creating and editing a form */}
    <Route path="/create" element={<CreateForm />} />

    {/* Route to view all saved forms */}
    <Route path="/myforms" element={<MyForms />} />

    {/* Route to preview/fill a specific form; expects an "id" query parameter */}
    <Route path="/preview" element={<PreviewForm />} />

    {/* Fallback route: redirect any unknown paths to "/create" */}
    <Route path="*" element={<Navigate to="/create" replace />} />
  </Routes>
);

export default AppRoutes;
