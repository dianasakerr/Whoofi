import { useRef } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";

interface Props {
  setHourlyRate: (rate: number) => void;
  onBack: () => void;
}

const EnterHourlyRate = ({ setHourlyRate, onBack }: Props) => {
  const rateRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    const rateValue = rateRef.current?.value;
    if (rateValue !== undefined && !isNaN(Number(rateValue))) {
      setHourlyRate(Number(rateValue));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          What's your hourly rate?
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="hourly-rate"
          label="Enter hourly rate"
          name="hourly-rate"
          autoComplete="off"
          autoFocus
          type="number"
          inputRef={rateRef}
          InputProps={{ inputProps: { min: 1 } }}
        />
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
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EnterHourlyRate;
