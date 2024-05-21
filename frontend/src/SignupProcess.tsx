import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChooseAccountType from './SignupProcessComponents/ChooseAccountType';
import EnterEmail from './SignupProcessComponents/EnterEmail';
import SetPassword from './SignupProcessComponents/SetPassword';
import SetName from './SignupProcessComponents/SetName';
import SubmitPage from './SignupProcessComponents/SubmitPage';
import SetLocation from './SignupProcessComponents/SetLocation';
import './styles/SignupProcess.css'



function SignupProccess() {
  const [name,setName] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<Array<number> | null>(null);
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
  setLocation(null);
};


  const onSubmit = async () => {
    fetch(import.meta.env.VITE_API_URL + 'create_user/', {
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
              coordinates: location,
              password: password,
              address: address,
              dogs: []
            } : {
              username: name,
              email: email,
              password: password,
              coordinates: location,
              address: address,
              phone_number:  "0545356002",
              hourly_rate: -1,
              years_of_experience: 3,
              age: 17
            }
        })
    }).then(res => {
        if (res.ok) {
            localStorage.setItem("token", email);
            navigate('/profile');
            console.log("User created successfully");
            return res.json();
        } else {
            console.log("Error creating user");
            return res.text().then(text => { throw new Error(text) });
        }
    }).then(data => {
        localStorage.setItem("token", email);
        console.log(data);
    }).catch(err => {
        console.error("my error log:", err);
    });
}

  return (
    <div className='signup-container'>
    <h1 className="title">Woofi signup process</h1>
    
    {
      (accountType === "") &&
      <ChooseAccountType setAccountType={setAccountType}/>
    }
    

    { 
      accountType !== "" &&
      email === "" &&
     <EnterEmail setEmail={setEmail}
     onBack={handleBackToAccountType} />
    }

    { email !== "" && 
    password === "" &&
    <SetPassword setPassword={setPassword} onBack={handleBackToEmail} />}


    {
      email !== "" &&
      password !== "" &&
      name === "" &&
      <SetName setName={setName}
      onBack={handleBackToSetPassword} />
    }

    {
      email !== "" &&
      password !== "" &&
      name !== "" &&
      !location &&
      <SetLocation setFinalLocation={setLocation}
     setFinalAddress={setAddress}
      onBack={handleBackToSetName} />
    }

    { email !== "" &&
    password !== "" &&
    name !== "" && 
    location && 
    <SubmitPage name={name} email={email} onSubmit={onSubmit} setEmail={setEmail} setName={setName} onBack={handleBackToSetLocation}/>}
    </div>
  )
}

export default SignupProccess;
