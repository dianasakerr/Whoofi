interface Props {
    setAccountType: (accountType: string) => void
}

const ChooseAccountType = ({setAccountType}: Props) => {
  return (
    <>
    <h1>Sign up as a</h1>
    <button onClick={() => setAccountType("owner")}>Dog owner</button>
    <button onClick={() => setAccountType("walker")}>Dog walker</button>
    </>
  )
}

export default ChooseAccountType