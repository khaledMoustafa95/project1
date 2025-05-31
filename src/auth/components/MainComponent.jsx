import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";

const drawerWidth = 240; // Make sure this matches your SideNavBar

export function MainComponent() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        ml: `${drawerWidth}px`,
      }}
    >
      <Toolbar /> {/* Push content below AppBar if used */}
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="body1">
        This is your main content area. You can place charts, tables, or cards
        here.
      </Typography>
    </Box>
  );
}
