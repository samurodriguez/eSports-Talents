import { useState, useEffect } from 'react';

function useRemoteTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8080/teams', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const fetchedTeams = await res.json();
      setTeams(fetchedTeams);
    };

    fetchData();
    let interval = setInterval(() => fetchData(), 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return [teams, setTeams];
}

export default useRemoteTeams;
