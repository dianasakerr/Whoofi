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
    <h3>Name: {name} <button onClick={() => setName("")}>change</button></h3>
    <h3>Email: {email} <button onClick={() => setEmail("")}>change</button></h3>
    <button onClick={onSubmit}>Sign up</button>
    </>
  )
}

export default SubmitPage