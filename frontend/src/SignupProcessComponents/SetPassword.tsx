import { useState } from "react";

interface Props {
    setPassword: (password: string) => void
}

const SetPassword = ({setPassword}:Props) => {

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [innerPassword, setInnerPassword] = useState<string>("");
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const handleNext = () => {
    
        if (innerPassword.length < 8 || innerPassword !== repeatedPassword) {
            // show alert for 3 seconds
            setShowAlert(true);
            setTimeout(() => {
            setShowAlert(false);
          },3000);
        }
        else {
            setPassword(innerPassword);
        }
      }

  return (
    <>
    <label >Choose Password
        <br/>
        <input 
          type='password'
          id="passwordField"
          placeholder='Enter password' 
          onChange={(e) => setInnerPassword(e.target.value)}>
        </input>
        </label>
        {showAlert && innerPassword.length < 8 && (<p>password must be longer then 8 characters</p>)}
        <br/>
        <label >Repeat Password
        <br/>
        <input 
          type='password' 
          id="repeatedPasswordField" 
          placeholder='Enter password' 
          onChange={(e) => setRepeatedPassword(e.target.value)}>
        </input>
        </label>
        {showAlert && innerPassword !== repeatedPassword && <p>repeated password must match the password</p>}
        <br/>
        <button
          className='subButton'
          type="submit" 
          onClick={() => handleNext()} 
          >
            next
        </button></>
  )
}

export default SetPassword