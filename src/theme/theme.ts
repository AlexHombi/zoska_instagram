"use client";

import { orange, purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: orange[500],
        },
        secondary: {
          main: purple[500],
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: orange[500],
        },
        secondary: {
          main: purple[500],
        },
      },
    },
  },
});

export default theme;