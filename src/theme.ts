import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#8e44ad", // Lilac/Violet color
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "##8e44ad", // Darker background
      paper: "#EBEBEB",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      '@media (max-width:600px)': {
        fontSize: "1.5rem",
      },
    },
    body1: {
      fontSize: "1rem",
      '@media (max-width:600px)': {
        fontSize: "0.875rem",
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
