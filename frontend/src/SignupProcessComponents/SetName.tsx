import { useRef, useState } from "react";

interface Props {
    setName: (name:string) => void
    onBack: () => void;
}

const SetName = ({setName,onBack}:Props) => {

  const nameRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
    
  const handleNext = () => {
    if (nameRef.current?.value !== undefined && nameRef.current?.value !== "") {
      setName(nameRef.current?.value);
    }
    else {
      setShowAlert(true);
      console.log(showAlert)
      setTimeout(() => {setShowAlert(false);},3000);
    }
  }

  return (
    <>
    <label>Name
    <input type="text" name="" id="" placeholder="Enter your name" ref={nameRef}/>
    </label>
    <button onClick={onBack}>Back</button>

    <button onClick={handleNext}>next</button>
    {showAlert && <p>name field can't be empty</p>}
    </>
  )
}

export default SetName