import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChooseAccountType from './SignupProcessComponents/ChooseAccountType';
import EnterEmail from './SignupProcessComponents/EnterEmail';
import SetPassword from './SignupProcessComponents/SetPassword';
import SetName from './SignupProcessComponents/SetName';
import SubmitPage from './SignupProcessComponents/SubmitPage';
import SetLocation from './SignupProcessComponents/SetLocation';
import { Container, Typography, Box, CssBaseline } from '@mui/material';


interface Location {
  lat: number,
  lng: number
};

function SignupProccess() {
  const [name,setName] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const navigate = useNavigate();


  const handleBackToEmail = () => {
    setEmail("");
  };

  const handleBackToAccountType = () => {
    setAccountType("");
  };

  const handleBackToSetPassword = () => {
  setPassword("");
};

const handleBackToSetName = () => {
  // Reset the name state
  setName("");
};

const handleBackToSetLocation = () => {
  // Reset the location state
  setLocation(undefined);
};

  const onSubmit = async () => {
    return fetch(import.meta.env.VITE_API_URL + 'create_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_type: accountType, // Make sure this is directly under the root of the JSON body
            user_data: accountType === 'owner' ? {
              username: name,
              email: email,
              phone_number: "0545356002",
              coordinates: [location?.lat,location?.lng],
              password: password,
              address: address,
              dogs: []
            } : {
              username: name,
              email: email,
              password: password,
              coordinates: [location?.lat,location?.lng],
              address: address,
              phone_number:  "0545356002",
              hourly_rate: -1,
              years_of_experience: 3,
              age: 17
            }
        })
    }).then(res => {
        if (res.ok) {
            localStorage.setItem('userType',accountType);
            localStorage.setItem("token", email);
            window.dispatchEvent(new Event('storage'));
            navigate('/profile');
            console.log("User created successfully");
            return true;
        } else {
            console.log("Error creating user");
            return false;
        }
    }).catch(err => {
        console.error("my error log:", err);
    });
}

return (
  <Container component="main" maxWidth="sm">
    <CssBaseline />
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5" className="title">
        Woofi Signup Process
      </Typography>
      {accountType === "" && <ChooseAccountType setAccountType={setAccountType} />}
      {accountType !== "" && email === "" && <EnterEmail setEmail={setEmail} onBack={handleBackToAccountType} />}
      {email !== "" && password === "" && <SetPassword setPassword={setPassword} onBack={handleBackToEmail} />}
      {email !== "" && password !== "" && name === "" && <SetName setName={setName} onBack={handleBackToSetPassword} />}
      {email !== "" && password !== "" && name !== "" && !location && 
        <SetLocation setFinalLocation={setLocation} setFinalAddress={setAddress} onBack={handleBackToSetName} />}
      {email !== "" && password !== "" && name !== "" && location && 
        <SubmitPage name={name} email={email} onSubmit={onSubmit} setEmail={setEmail} setName={setName} onBack={handleBackToSetLocation} />}
    </Box>
  </Container>
)
}

export default SignupProccess;