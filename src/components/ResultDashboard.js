import React, { useEffect, useState } from 'react';
import { FaBackward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserResultsComponent = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    const getResults = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rounds');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); // Log the actual data
            setResults(data); // Set fetched data to state
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResults(); // Fetch results when component mounts
    }, []);

    const navigate = useNavigate();

    // Function to chunk the results array into smaller arrays of length 5
    const chunkResults = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    // Chunk the results array into groups of 5
    const chunkedResults = chunkResults(results, 5);

    return (
        <div>
            <h1>User Results</h1>
            <FaBackward className="add-website-btn" onClick={() => navigate('/')} />
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                chunkedResults.map((chunk, chunkIndex) => (
                    <div key={chunkIndex}>
                        <h2>
                            Game History {chunkIndex + 1} - Last Update: 
                            {chunk.length > 0 && new Date(chunk[chunk.length - 1].updatedAt).toLocaleString()}
                        </h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chunk.map((round, index) => (
                                    <tr key={index}>
                                        <td>{round.round}</td>
                                        <td>{round.winner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserResultsComponent;
