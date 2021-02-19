import React, { useState, useEffect } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

function useRemotePosts() {
  const [posts, setPosts] = useState([]);
  const [token] = React.useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8080/home', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      const fetchedPosts = await res.json();
      setPosts(fetchedPosts);
    };

    fetchData();
    let interval = setInterval(() => fetchData(), 100000);

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  return [posts, setPosts];
}

export default useRemotePosts;
