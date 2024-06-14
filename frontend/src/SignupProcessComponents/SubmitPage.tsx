import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  name: string;
  email: string;
  address: string;
  birthDate: string;
  phoneNumber: string;
  hourlyRate?: number;
  onSubmit: () => Promise<{ status: number }>;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setBirthDate: (birthDate: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setHourlyRate: (rate: number | undefined) => void;
}

const SubmitPage = ({
  name,
  email,
  address,
  birthDate,
  phoneNumber,
  hourlyRate,
  onSubmit,
  setEmail,
  setName,
  setAddress,
  setBirthDate,
  setPhoneNumber,
  setHourlyRate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    onSubmit()?.then((res) => {
      if (res.status !== 200) {
        setError(
          "Sign up failed, make sure your input is correct and try again."
        );
      }
      setLoading(false);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="h5" component="h3" gutterBottom>
              Name: {name}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setName("")}
              sx={{ ml: 2 }}
            >
              Change
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="h5" component="h3" gutterBottom>
              Email: {email}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setEmail("")}
              sx={{ ml: 2 }}
            >
              Change
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="h5" component="h3" gutterBottom>
              Address: {address}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setAddress("")}
              sx={{ ml: 2 }}
            >
              Change
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="h5" component="h3" gutterBottom>
              Birth Date: {birthDate}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setBirthDate("")}
              sx={{ ml: 2 }}
            >
              Change
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="h5" component="h3" gutterBottom>
              Phone Number: {phoneNumber}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setPhoneNumber("")}
              sx={{ ml: 2 }}
            >
              Change
            </Button>
          </TableCell>
        </TableRow>
        {hourlyRate !== undefined && (
          <TableRow>
            <TableCell>
              <Typography variant="h5" component="h3" gutterBottom>
                Hourly Rate: {hourlyRate}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setHourlyRate?.(undefined)}
                sx={{ ml: 2 }}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {error && <p>{error}</p>}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <LoadingButton
          sx={{ height: 40 }}
          loading={loading}
          onClick={handleSubmit}
          fullWidth
          variant="contained"
        >
          {!loading && "Sign up"}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SubmitPage;
