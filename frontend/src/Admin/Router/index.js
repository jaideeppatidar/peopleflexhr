import React from "react";
import { Routes, Route } from "react-router-dom";

// import AdminLogin from "../auth/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminPayslip from "../pages/AdminPayslip/AdminPayslip";
import AdminPaySlipTableData from '../pages/AdminPayTable/AdminPaySlipTable'
import AdminLayout from "../components/Layout/AdminLayout";
import { ROUTES } from './constants'
import { PrivateRoute } from "./PrivateRoute";

export const AdminRouting = () => {
    return (
        <Routes>
     {/* <Route path={ROUTES.LOGIN} element={<AdminLogin />} /> */}

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        < AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard/>}/>
                <Route path={ROUTES.ADMIN_PAY_SLIP} element={<AdminPayslip />} />
                <Route path={ROUTES.ADMIN_DataTable} element={<AdminPaySlipTableData />} />
            
            </Route>
        </Routes>
    )
}