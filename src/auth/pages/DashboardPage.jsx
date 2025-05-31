import React from "react";

import SideNavBar from "../components/SideNavBar";
import { MainComponent } from "../components/MainComponent";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function DashboardPage() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideNavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardPage;
