import { useState } from "react";
import { Box, Button, Container, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";

interface Props {
  onBack: () => void;
  setFinal: (arg: number | null) => void;
}

const SetExperience = ({ onBack, setFinal }: Props) => {
  const [exp, setExp] = useState<number | null>(null);

  return (
    <Container component="main" maxWidth="sm">
      <Box>
        <div>How many years have you been a dog walker?</div>

        <Select
          value={exp}
          label="Age"
          onChange={(event) => setExp(event.target.value as number)}
        >
          {[...Array(35).keys()].map((i) => (
            <MenuItem value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFinal(exp)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SetExperience;
