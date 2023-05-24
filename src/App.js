import React from "react";
import Menu from "./pages/menu";
import Login from "./pages/login";
import Transaksi from "./pages/transaksi";
import Middleware from "./pages/middleware";
import Sidebar from "./pages/sidebar";
import Meja from "./pages/meja";
import { Route, Routes, BrowserRouter } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter> 
            <Routes>
        <Route path="/menu" element={<Middleware><Sidebar title="Daftar Menu"><Menu /></Sidebar></Middleware>} />
        <Route path="/login" element={<Login />} />
        <Route path="/transaksi" element={<Middleware><Sidebar title="Daftar Transfer"><Transaksi /></Sidebar></Middleware>} />
        <Route path="/test" element={<Sidebar/>}></Route>
        <Route path="/meja" element={<Middleware><Sidebar title="Daftar Meja"><Meja /></Sidebar></Middleware>} />
      </Routes>
        </BrowserRouter>
    )
}