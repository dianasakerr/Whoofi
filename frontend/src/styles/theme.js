import { createTheme } from "@mui/material/styles";

// Define your custom color palette
const salmonRedPalette = {
  primary: {
    main: "#ff8a80", // Salmon Red
  },
  secondary: {
    main: "#ffccbc", // Light Salmon Red
  },
};

let theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& .MuiInputBase-root": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
  },
});

theme = createTheme({
  palette: {
    primary: theme.palette.augmentColor({
      color: {
        main: "#FF5733",
      },
      name: "salmon",
    }),
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& .MuiInputBase-root": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
  },
});

export default theme;
