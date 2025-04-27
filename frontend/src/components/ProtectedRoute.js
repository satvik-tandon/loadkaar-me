import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


function ProtectedRoute({element}) {
    const {email, password} = useSelector((state) => state.user);

    if(!email || !password) {
        return <Navigate to='/' replace />;
    }

    return element;
}

export default ProtectedRoute;