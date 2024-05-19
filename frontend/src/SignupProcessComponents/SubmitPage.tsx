interface Props {
    name: string
    email: string
    onSubmit: () => void
    setEmail: (email: string) => void
    setName: (name: string) => void
    onBack: () => void;
}

const SubmitPage = ({name, email, onSubmit,setEmail,setName,onBack}: Props) =>  {
  return (
    <>
    <h3>Name: {name} <button onClick={() => setName("")}>change</button></h3>
    <h3>Email: {email} <button onClick={() => setEmail("")}>change</button></h3>
    <button onClick={onSubmit}>Sign up</button>
    <button onClick={onBack}>Back</button>
    </>
  )
}

export default SubmitPage