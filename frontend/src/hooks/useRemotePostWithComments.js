import { useState, useEffect } from 'react';

function useRemotePostWithComments(postId) {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPostById = async () => {
      const res = await fetch(`http://localhost:8080/post/${postId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const post = await res.json();
      setPost(post);
    };

    getPostById();
  }, [postId]);

  return [post, setPost];
}

export default useRemotePostWithComments;
