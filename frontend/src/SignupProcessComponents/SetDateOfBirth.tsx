import { Box, Button, Container, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

interface Props {
  setFinal: (arg: string) => void;
  onBack: () => void;
}

const SetDateOfBirth = ({ setFinal, onBack }: Props) => {
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  const confirmDate = () => {
    console.log(dateOfBirth);
    setFinal(dateOfBirth);
  };

  return (
    <Container>
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          When where you born?
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label="Select Date"
            onChange={(newValue) => {
              if (newValue) {
                setDateOfBirth(newValue.format("DD-MM-YYYY"));
              }
            }}
          />
        </LocalizationProvider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 2,
          }}
        >
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={confirmDate}>
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SetDateOfBirth;
