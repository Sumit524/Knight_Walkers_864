import React, { useEffect, useState } from 'react';

// Step 1: Define the Location interface
interface Location {
    name: string;
    address: string;
    rating?: number; // Optional because not all locations may have a rating
    distance?: string; // Optional because not all locations may have a rating

}

const LocationResults: React.FC = () => {
    // Step 2: Specify the state type
    const [locations, setLocations] = useState<Location[]>([]); // Array of Location objects

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/locations/')
            .then(response => response.json())
            .then(data => setLocations(data)) // Assuming `data` is an array of Location objects
            .catch(error => console.error("Error fetching locations:", error));
    }, []);

    return (
        <div>
            <h1>Nearby Locations Matching Preferences</h1>
            <ul>
            {locations.map((location, index) => (
                    <li key={index}>
                        <h2>{location.name}</h2>
                        <p>Address: {location.address}</p>
                        <p>Rating: {location.rating}</p>
                        <p>Distance: {location.distance} meters</p>
                        {/* <p>Categories: {location.categories.join(", ")}</p> */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LocationResults;
