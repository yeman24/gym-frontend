import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/shared/Layout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Home } from "./pages/Home";
import { Membership } from "./pages/Membership";
import { Classes } from "./pages/Classes";
import { Trainers } from "./pages/Trainers";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

export default function App() { return <BrowserRouter><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/membership" element={<Membership />} /><Route path="/classes" element={<Classes />} /><Route path="/trainers" element={<Trainers />} /><Route path="/contact" element={<Contact />} /></Route><Route path="/admin/login" element={<AdminLogin />} /><Route element={<ProtectedRoute />}><Route path="/admin" element={<AdminDashboard />} /></Route></Routes></BrowserRouter>; }
