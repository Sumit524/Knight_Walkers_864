import { useEffect, useState } from 'react';
import axios from 'axios';
import AvailableLocations from './components/location/AvailableLocations'

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/hello/')
            .then(response => setMessage(response.data.message))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="App">
            <h1>{message}</h1>
            <AvailableLocations/>
        </div>
    );
}

export default App;
