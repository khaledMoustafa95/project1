import React, { useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CssBaseline,
  AppBar,
  Alert,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { logoutUser } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;
const menuItems = [
  { label: "Create", path: "/dashboard/create", icon: <InboxIcon /> },
  { label: "View", path: "/dashboard/view", icon: <MailIcon /> },
];
export default function SideNavBar() {
  const { authDispatch } = useAuth();
  const [locale, setLocale] = useState("en");
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {t("Dashboard")}
        </Toolbar>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          <List>
            {menuItems.map(({ label, path, icon }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  selected={location.pathname === path}
                  onClick={() => navigate(path)}
                >
                  <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                  <ListItemText primary={t(label)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={async () => {
                if (locale === "en") {
                  i18n.changeLanguage("ar");
                  setLocale("ar");
                } else {
                  i18n.changeLanguage("en");
                  setLocale("en");
                }
              }}
            >
              <ListItemIcon>{<InboxIcon />}</ListItemIcon>
              <ListItemText primary={locale === "en" ? "عربي" : "English"} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={async () => {
                const result = await logoutUser(authDispatch);
                if (result.success) {
                  console.log("Logout successful.");
                  navigate("/login");
                } else {
                  console.error("Logout failed:", result.error);
                }
              }}
            >
              <ListItemIcon>{<InboxIcon />}</ListItemIcon>
              <ListItemText primary={t("Logout")} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
}
