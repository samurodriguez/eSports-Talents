import { useContext, useState } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory } from 'react-router-dom';

const PostWriter = () => {
  const history = useHistory();
  const [token] = useContext(AuthContext);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const sendPost = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/home', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ title: postTitle, content: postContent }),
    });

    await res.json();

    if (res.status !== 200) {
      console.error('El titulo y el contenido no pueden estar vacíos');
    }

    setPostTitle('');
    setPostContent('');
    history.push('/profile');
  };

  const titleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const contentChange = (e) => {
    setPostContent(e.target.value);
  };

  return (
    <form id="postWriter" onSubmit={sendPost}>
      <input onChange={titleChange} value={postTitle} placeholder="Título..." required></input>
      <textarea
        onChange={contentChange}
        value={postContent}
        placeholder="Escribe tu publicación aquí..."
        required
      ></textarea>
      <button>Publicar</button>
    </form>
  );
};

export default PostWriter;
