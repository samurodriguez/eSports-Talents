import { useState, useEffect } from 'react';

const useUserSharingName = (userId) => {
  const [userSharingName, setUserSharingName] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchSharingName = async () => {
        const res = await fetch(`http://localhost:8080/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });
        const user = await res.json();
        if (res.status === 200) {
          const name = user.userInfo.usr_name;
          const lastname = user.userInfo.usr_lastname;

          setUserSharingName(`${name} ${lastname}`);
        }
      };

      fetchSharingName();

      let interval = setInterval(() => fetchSharingName(), 50000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [userId]);

  return [userSharingName, setUserSharingName];
};

export default useUserSharingName;
