import { useEffect, useState } from "react"
import WalkerCard from "./WalkerCard";
import './searchProvider.css'

interface User {
    id: number;
    name: string;
    email: string;
}

const SearchProvider = () => {

    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const URL = "https://jsonplaceholder.typicode.com/users"; // replace with our own api
    
    useEffect(() => {
        
        // Fetch profiles from an API endpoint
        fetch(URL)
          .then(response => response.json())
          .then(data => {
            setData(data);
            setLoading(false);})
          .catch(error => {
            console.error('Error fetching profiles:', error);
            setLoading(false);
          })    
          
      }, []);



  return (
    <>
    <h3>Woofi</h3>
    <h3>walkers near you</h3>
    <div className="scroller">
        {data.map((user, index) => (
            <div key={index} className="card">
            <WalkerCard key={index} name={user.name} image_url=""/>
            </div>
        ))}
    </div>
    {loading && <img src="./logosAndIcons/Loading.gif"/>}
    </>
)
}

export default SearchProvider