import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChooseAccountType from "./SignupProcessComponents/ChooseAccountType";
import EnterEmail from "./SignupProcessComponents/EnterEmail";
import SetPassword from "./SignupProcessComponents/SetPassword";
import SetName from "./SignupProcessComponents/SetName";
import SubmitPage from "./SignupProcessComponents/SubmitPage";
import SetLocation from "./SignupProcessComponents/SetLocation";
import { Container, Typography, Box, CssBaseline } from "@mui/material";
import SetDateOfBirth from "./SignupProcessComponents/SetDateOfBirth";
import SetExperience from "./SignupProcessComponents/SetExperience";
import EnterHourlyRate from "./SignupProcessComponents/EnterHourlyRate";
import SetPhoneNumber from "./SignupProcessComponents/SetPhoneNumber";

interface Location {
  lat: number;
  lng: number;
}

function SignupProcess() {
  const [name, setName] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [location, setLocation] = useState<Location>();
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [exp, setExp] = useState<number | null>();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => console.log(birthDate, typeof birthDate), [birthDate]);

  const onSubmit = async () => {
    const url = import.meta.env.VITE_API_URL + "create_user/?";

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_type: accountType,
        username: name,
        email: email,
        phone_number: phoneNumber, // Using phone number from state
        longitude: location ? location.lng : 0,
        latitude: location ? location.lat : 0,
        password: password,
        date_of_birth: birthDate,
        hourly_rate: hourlyRate ? hourlyRate : 0,
        years_of_experience: exp ? exp : 0,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            localStorage.setItem("token", data.access_token);
            window.dispatchEvent(new Event("storage"));
          });
          navigate("/profile");
          console.log("User created successfully");
        } else {
          console.log("Error creating user");
          return { status: res.status };
        }
      })
      .catch((err) => {
        console.error("my error log:", err);
        return { status: 404 };
      });
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" className="title">
          Whoofi Signup Process
        </Typography>

        {accountType === "" && (
          <ChooseAccountType setAccountType={setAccountType} />
        )}

        {accountType !== "" && email === "" && (
          <EnterEmail setEmail={setEmail} onBack={() => setAccountType("")} />
        )}

        {email !== "" && password === "" && (
          <SetPassword setPassword={setPassword} onBack={() => setEmail("")} />
        )}

        {email !== "" && password !== "" && name === "" && (
          <SetName setName={setName} onBack={() => setPassword("")} />
        )}

        {email !== "" && password !== "" && name !== "" && birthDate === "" && (
          <SetDateOfBirth setFinal={setBirthDate} onBack={() => setName("")} />
        )}

        {email !== "" &&
          password !== "" &&
          name !== "" &&
          birthDate !== "" &&
          phoneNumber === "" && (
            <SetPhoneNumber
              setPhoneNumber={setPhoneNumber}
              onBack={() => setBirthDate("")}
            />
          )}

        {email !== "" &&
          password !== "" &&
          name !== "" &&
          birthDate !== "" &&
          phoneNumber !== "" &&
          !location && (
            <SetLocation
              setFinalLocation={setLocation}
              setFinalAddress={setAddress}
              onBack={() => setPhoneNumber("")}
            />
          )}

        {location && accountType === "walker" && hourlyRate === undefined && (
          <EnterHourlyRate
            setHourlyRate={setHourlyRate}
            onBack={() => setLocation(undefined)}
          />
        )}

        {location &&
          hourlyRate &&
          accountType === "walker" &&
          exp === undefined && (
            <SetExperience
              onBack={() => setHourlyRate(undefined)}
              setFinal={setExp}
            />
          )}

        {email !== "" &&
          password !== "" &&
          name !== "" &&
          location &&
          birthDate &&
          phoneNumber &&
          (exp || accountType === "owner") && (
            <SubmitPage
              name={name}
              email={email}
              address={address}
              birthDate={birthDate}
              phoneNumber={phoneNumber}
              hourlyRate={hourlyRate}
              onSubmit={onSubmit}
              setEmail={setEmail}
              setName={setName}
              setAddress={setAddress}
              setBirthDate={setBirthDate}
              setPhoneNumber={setPhoneNumber}
              setHourlyRate={setHourlyRate}
            />
          )}
      </Box>
    </Container>
  );
}

export default SignupProcess;
