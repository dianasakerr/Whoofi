import { useState } from "react";
import { TextField, Button, FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
  close: () => void;
}

const AddDog = ({ close }: Props) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [race, setRace] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          "create_dog/?token=" +
          localStorage.getItem("token"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            date_of_birth: birthDate,
            race: race,
            weight: weight,
          }),
        }
      );

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("storage"));
      console.log({ name, birthDate, race, weight });
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormControl
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TextField
        label="Name"
        value={name}
        sx={{ mt: 1 }}
        onChange={(e) => setName(e.target.value)}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disableFuture
          label="Select Date"
          sx={{ mt: 1 }}
          onChange={(newValue) => {
            if (newValue) {
              setBirthDate(newValue.format("DD-MM-YYYY"));
            }
          }}
        />
      </LocalizationProvider>
      <TextField
        label="Race"
        value={race}
        onChange={(e) => setRace(e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button onClick={handleSubmit}>Add dog</Button>
    </FormControl>
  );
};

export default AddDog;
