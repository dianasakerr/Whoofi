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

  const onSubmit = () => {
    console.log({
      accountType: accountType,
      name: name,
      email: email,
      password: password})

      // In here we'll replace the console log with requests to the server and the appropriate behavior according to it's response

      setTimeout(() => setCurrentWindow("Scroller"), 1000);
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
