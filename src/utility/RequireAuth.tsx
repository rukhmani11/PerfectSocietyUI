
import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import { AuthContext } from "./context/AuthContext";

const RequireAuth: React.FC<any> = ({ allowedRoles, }) => {

    const { auth } = React.useContext(AuthContext);
    const location = useLocation();
    return (

        auth?.Roles?.find((role: any) => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.Token
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;