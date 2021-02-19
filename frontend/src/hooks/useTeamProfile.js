import { useState, useEffect } from 'react';

const useTeamProfile = (teamId) => {
  const [teamProfile, setTeamProfile] = useState([]);

  useEffect(() => {
    const getTeamProfile = async () => {
      const res = await fetch(`http://localhost:8080/team/${teamId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const fetchedTeamProfile = await res.json();
      setTeamProfile(fetchedTeamProfile);
    };

    getTeamProfile();
    let interval = setInterval(() => getTeamProfile(), 50000);

    return () => {
      clearInterval(interval);
    };
  }, [teamId]);

  return [teamProfile, setTeamProfile];
};

export default useTeamProfile;
