import '../styles/ChooseAccountType.css'

interface Props {
    setAccountType: (accountType: string) => void
}

const ChooseAccountType = ({setAccountType}: Props) => {
  return (
    <div className='container'>
    <h1>Sign up as a</h1>
    <button className='btn' onClick={() => setAccountType("owner")}>Dog owner</button>
    <button className='btn' onClick={() => setAccountType("walker")}>Dog walker</button>
    </div>
  )
}

export default ChooseAccountType