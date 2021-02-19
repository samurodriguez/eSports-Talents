import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const useFollowCheck = (userId) => {
  const [token] = useContext(AuthContext);
  const [doesUserFollowUser, setFollowCheck] = useState(0);

  useEffect(() => {
    if (token !== '') {
      const checkFollow = async () => {
        const res = await fetch(`http://localhost:8080/user/${userId}/follow_check`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `${token}`,
          },
        });

        const followCheck = await res.json();
        setFollowCheck(followCheck.followCheck);
      };

      checkFollow();

      let interval = setInterval(() => checkFollow(), 50000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [token, userId]);

  return [doesUserFollowUser, setFollowCheck];
};

export default useFollowCheck;
