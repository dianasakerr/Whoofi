import { useState } from 'react';
import ChooseAccountType from './SignupProcessComponents/ChooseAccountType';
import EnterEmail from './SignupProcessComponents/EnterEmail';
import SetPassword from './SignupProcessComponents/SetPassword';
import SetName from './SignupProcessComponents/SetName';
import SubmitPage from './SignupProcessComponents/SubmitPage';
import Construction from './Construction';

interface Props {
  setCurrentWindow: (window: string) => void;
}

function SignupProccess({setCurrentWindow}: Props) {

  const [name,setName] = useState<string>("");
  const [accountType, setAcountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async () => {
    const newUserData = {
        id: "undefined",
        username: name,
        email: email,
        password: password,
        address: "undefined",
        city: "undefined",
        region: "undefined",
        phone_number: "undefined"
    }

    fetch('http://localhost:8000/create_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_type: accountType, // Make sure this is directly under the root of the JSON body
            user_data: newUserData
        })
    }).then(res => {
        if (res.ok) {
            console.log("User created successfully");
            return res.json();
        } else {
            console.log("Error creating user");
            return res.text().then(text => { throw new Error(text) });
        }
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.error("Error:", err);
    });
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
      <SubmitPage name={name} email={email} onSubmit={onSubmit} setEmail={setEmail} setName={setName}/>
    }
    </>
  )
}

export default SignupProccess;
