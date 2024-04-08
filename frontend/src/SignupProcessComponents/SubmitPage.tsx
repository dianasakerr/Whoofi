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
    <h3 onClick={() => setName("")}>Name: {name}</h3>
    <h3 onClick={() => setEmail("")}>Email: {email}</h3>
    <button onClick={onSubmit}>Sign up</button>
    </>
  )
}

export default SubmitPage