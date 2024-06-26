import React, { useState, useEffect } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./styles/Admin.css";

interface User {
  username: string;
  email: string;
  user_type: string;
  manager_type: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true); // Set loading to true when starting fetch
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          "see_all_users/?token=" +
          localStorage.getItem("token")
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(
        data.filter((user: User) => user.username !== "manager")
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Set loading to false when fetch is done (success or error)
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) &&
        user.username !== "manager"
    );
    setFilteredUsers(filteredUsers);
  };

  const deleteUser = (email: string, user_type: string) => {
    fetch(
      import.meta.env.VITE_API_URL +
        "delete_user/?token=" +
        localStorage.getItem("token") +
        "&email=" +
        email +
        "&user_type=" +
        user_type,
      {
        method: "DELETE",
      }
    );
    setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
    setFilteredUsers((prevUsers) =>
      prevUsers.filter((user) => user.email !== email)
    );
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        style={{ marginBottom: "20px" }}
      />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.email}
              sx={{
                backgroundColor: "white",
                my: "3px",
                boxShadow: "3px 2px 2px rgb(0 0 0 / 30%)",
                borderRadius: "20px",
                opacity: "95%",
              }}
            >
              <ListItemAvatar>
                <Avatar>{user.username.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={
                  <Typography variant="body2">{user.email}</Typography>
                }
              />
              <Typography
                className="delete-btn"
                onClick={() => deleteUser(user.email, user.user_type)}
              >
                X
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Admin;
