"use client"

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Button } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export default function DarkModeButton() {
  const { mode, setMode } = useColorScheme();

  return (
    <Button
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}