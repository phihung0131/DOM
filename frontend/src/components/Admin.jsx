import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./Admin.module.css";
import AdminSidebarNav from "./AdminSidebarNav";

const Admin = () => {
    const [expand, setExpand] = useState(true);

    return (
        <>
            <AdminSidebarNav expand={expand} setExpand={setExpand}/>

            <div className={`${styles["container"]} ${expand ? styles["expand"] : ""}`}>
                <Outlet />
            </div>
        </>
    );
};

export default Admin;
