import React, { useState, useEffect } from "react";
import {
  TextField,
  ListItemAvatar,
  Avatar,
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import "./styles/Admin.css";

interface User {
  username: string;
  email: string;
  user_type: string;
  manager_type: string;
  years_of_experience?: number;
  hourly_rate?: number;
  location?: string;
  phone_number?: string;
  coordinates?: [number, number];
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers(searchTerm, userTypeFilter);
  }, [users, searchTerm, userTypeFilter]);

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
  };

  const handleUserTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const userType = event.target.value as string;
    setUserTypeFilter(userType);
  };

  const filterUsers = (searchTerm: string, userType: string) => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) &&
        user.username !== "manager" &&
        (userType === "" || user.user_type === userType)
    );
    setFilteredUsers(filtered);
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
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
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
      <FormControl variant="outlined" fullWidth style={{ marginBottom: "20px" }}>
        <InputLabel>User Type</InputLabel>
        <Select
          value={userTypeFilter}
          onChange={handleUserTypeChange}
          label="User Type"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="walker">Walker</MenuItem>
        </Select>
      </FormControl>
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
        <div className="user-cards-container">
          {filteredUsers.map((user) => (
            <Card
              key={user.email}
              sx={{
                backgroundColor: "white",
                boxShadow: "3px 3px 3px rgb(0 0 0 / 30%)",
                borderRadius: "10px",
                opacity: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "10px",
                flex: "1 0 21%",
                minWidth: "200px",
                maxWidth: "250px",
              }}
            >
              <CardContent>
                <ListItemAvatar>
                  <Avatar>{user.username.charAt(0)}</Avatar>
                </ListItemAvatar>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="body2">
                  User Type: {user.user_type}
                </Typography>
                {user.user_type === "walker" && (
                  <div>
                    <Typography variant="body2">
                      Experience: {user.years_of_experience} years
                    </Typography>
                    <Typography variant="body2">
                      Price: {user.hourly_rate}₪ per hour
                    </Typography>
                  </div>
                )}
                <Typography variant="body2">
                  Phone: {user.phone_number || "N/A"}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="secondary"
                  onClick={() => deleteUser(user.email, user.user_type)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Admin;
