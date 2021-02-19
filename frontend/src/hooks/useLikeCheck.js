import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const useLikeCheck = (postId) => {
  const [token] = useContext(AuthContext);
  const [doesUserLikePost, setLikeCheck] = useState(0);

  useEffect(() => {
    if (token !== '') {
      const checkLike = async () => {
        const res = await fetch(`http://localhost:8080/post/${postId}/like_check`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `${token}`,
          },
        });

        const likeCheck = await res.json();
        setLikeCheck(likeCheck.likeCheck);
      };

      checkLike();

      let interval = setInterval(() => checkLike(), 50000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [token, postId]);

  return [doesUserLikePost, setLikeCheck];
};

export default useLikeCheck;
