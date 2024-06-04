import { useRef } from "react";
import { Box, Button, Container, TextField } from "@mui/material";

interface Props {
  onBack: () => void;
  setFinal: (arg: number | null) => void;
}

const SetExperience = ({ onBack, setFinal }: Props) => {
  const expRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    const rateValue = expRef.current?.value;
    if (rateValue !== undefined && !isNaN(Number(rateValue))) {
      setFinal(Number(rateValue));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box>
        <div>How many years have you been a dog walker?</div>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="hourly-rate"
          label="Enter your experience in years"
          name="hourly-rate"
          autoComplete="off"
          autoFocus
          type="number"
          inputRef={expRef}
          InputProps={{ inputProps: { min: 1, max: 40 } }}
        />
        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SetExperience;
