import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const useShareCheck = (postId) => {
  const [token] = useContext(AuthContext);
  const [doesUserSharePost, setShareCheck] = useState(0);

  useEffect(() => {
    if (token !== '') {
      const checkShare = async () => {
        const res = await fetch(`http://localhost:8080/post/${postId}/share_check`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `${token}`,
          },
        });

        const shareCheck = await res.json();
        setShareCheck(shareCheck.shareCheck);
      };

      checkShare();

      let interval = setInterval(() => checkShare(), 50000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [token, postId]);

  return [doesUserSharePost, setShareCheck];
};

export default useShareCheck;
