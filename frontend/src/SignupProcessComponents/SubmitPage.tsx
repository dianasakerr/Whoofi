interface Props {
    name: string
    email: string
    onSubmit: () => void
    setEmail: (email: string) => void
    setName: (name: string) => void
}

const SubmitPage = ({name, email, onSubmit,setEmail,setName}: Props) =>  {
  return (
    <>
    <h3 >Name: {name} <button onClick={() => setName("")}>Change name</button></h3>
    <h3>Email: {email} <button onClick={() => setEmail("")}>Change email</button></h3>
    <button onClick={onSubmit}>Sign up</button>
    </>
  )
}

export default SubmitPage