import { useState, useEffect } from 'react';

const useUserProfile = (userId) => {
  const [userProfile, setUserProfile] = useState([]);

  useEffect(() => {
    const getUserProfile = async () => {
      const res = await fetch(`http://localhost:8080/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const fetchedUserProfile = await res.json();
      setUserProfile(fetchedUserProfile);
    };

    getUserProfile();
    let interval = setInterval(() => getUserProfile(), 50000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  return [userProfile, setUserProfile];
};

export default useUserProfile;
