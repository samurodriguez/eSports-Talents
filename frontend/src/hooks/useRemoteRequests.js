import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const useRemoteRequests = () => {
  const [token] = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      const res = await fetch(`http://localhost:8080/requests`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });

      const fetchedRequests = await res.json();
      setRequests(fetchedRequests);
    };

    getRequests();
    let interval = setInterval(() => getRequests(), 50000);

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  return [requests, setRequests];
};

export default useRemoteRequests;
