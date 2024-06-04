import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  name: string;
  email: string;
  address: string;
  birthDate: string;
  hourlyRate?: number;
  onSubmit: () => Promise<boolean | void>;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setBirthDate: (birthDate: string) => void;
  setHourlyRate: (rate: number | undefined) => void;
}

const SubmitPage = ({
  name,
  email,
  address,
  birthDate,
  hourlyRate,
  onSubmit,
  setEmail,
  setName,
  setAddress,
  setBirthDate,
  setHourlyRate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    onSubmit()?.then((res) => {
      if (res) {
        setLoading(false);
      } else if (res === false) {
        setError("This email already has an account. Sign in instead.");
      } else {
        setError(
          "A server error has occurred. Please check your internet connection and try again."
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
      <Typography variant="h5" component="h3" gutterBottom>
        Name: {name}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setName("")}
          sx={{ ml: 2 }}
        >
          Change
        </Button>
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>
        Email: {email}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setEmail("")}
          sx={{ ml: 2 }}
        >
          Change
        </Button>
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>
        Address: {address}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setAddress("")}
          sx={{ ml: 2 }}
        >
          Change
        </Button>
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>
        Birth Date: {birthDate}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setBirthDate("")}
          sx={{ ml: 2 }}
        >
          Change
        </Button>
      </Typography>
      {hourlyRate !== undefined && (
        <Typography variant="h5" component="h3" gutterBottom>
          Hourly Rate: {hourlyRate}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setHourlyRate?.(undefined)}
            sx={{ ml: 2 }}
          >
            Change
          </Button>
        </Typography>
      )}
      {error && <p>{error}</p>}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <LoadingButton
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
