import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const nav = useNavigate();

  const checkLocalStorage = () => {
    const item = localStorage.getItem("token");
    setIsSignedIn(!!item);
  };

  useEffect(() => {
    checkLocalStorage();

    const handleStorageChange = () => {
      console.log("Storage change heard from header");
      checkLocalStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
    nav('/');
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width={"100vw"}>
          <Button color="inherit" component={Link} to="/">
            Home Page
          </Button>
          {isSignedIn ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                My Profile
              </Button>
              <Button color="inherit" onClick={handleSignOut}>
                Exit
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Sign in
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/search">
            Look for a Dog Walker
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
