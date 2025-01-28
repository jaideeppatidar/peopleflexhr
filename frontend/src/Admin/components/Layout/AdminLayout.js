import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../AdminSidebar/AdminSidebar";
import "./AdminLayout.css";
import HeaderAdmin from "../../../Admin/components/HeaderAdmin/Headeradmin";

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="Admins-layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="Admins-main-content">
                <HeaderAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="Admins-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
