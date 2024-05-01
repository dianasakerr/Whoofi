import { useState } from 'react';
import ChooseAccountType from './SignupProcessComponents/ChooseAccountType';
import EnterEmail from './SignupProcessComponents/EnterEmail';
import SetPassword from './SignupProcessComponents/SetPassword';
import SetName from './SignupProcessComponents/SetName';
import SubmitPage from './SignupProcessComponents/SubmitPage';
import SetLocation from './SignupProcessComponents/SetLocation';
import Construction from './Construction';

interface Props {
  setCurrentWindow: (window: string) => void;
}

function SignupProccess({setCurrentWindow}: Props) {
  const [name,setName] = useState<string>("");
  const [accountType, setAcountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useState(null);

  const onSubmit = async () => {

    const newUserData = {
      "id": 10,
      "username": "didi",
      "email": "bla@gmail.com",
      "city": "Daliat ElCarmel",
      "region": "Haifa",
      "user_type": "dogowner",
      "dog_name": "pepsi",
      "dog_birth_date": "2022-04-16",
      "dog_type": "Labrador",
      "dogs": [
          "dog1",
          "dog2"
      ]
  }

    fetch('http://localhost:8000/create_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData)
    }).then(res => {
      if (res.ok) {
        console.log(res);
      }
      else {
        console.log("EROOR");
        console.log(res.body);
      }
    })

    newUserData

      // setTimeout(() => setCurrentWindow("Scroller"), 1000);
  }

  return (
    <>
    <h1 className="title">Woofi signup process</h1>
    
    {
      (accountType === "") &&
      <ChooseAccountType setAccountType={setAcountType}/>
    }
    
    {
      accountType === "walker" &&
      <Construction/>
    }

    { 
      accountType === "owner" &&
      email === "" &&
     <EnterEmail setEmail={setEmail}/>
    }

    { email !== "" &&
      password === "" &&
      <SetPassword setPassword={setPassword}/>
    }

    {
      email !== "" &&
      password !== "" &&
      name === "" &&
      <SetName setName={setName}/>
    }

    {
      email !== "" &&
      password !== "" &&
      name !== "" &&
      ! location &&
      <SetLocation setLocation={setLocation}/>
    }

    { email !== "" &&
    password !== "" &&
    name !== "" && 
    location && 
    <SubmitPage name={name} email={email} onSubmit={onSubmit} setEmail={setEmail} setName={setName}/>}
    </>
  )
}

export default SignupProccess;
