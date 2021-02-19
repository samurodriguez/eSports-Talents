import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory } from 'react-router-dom';
import decodeTokenData from '../utils/decodeTokenData';
import getPostImage from '../utils/getPostImage';
import UserInfoHeader from './UserInfoHeader';

const Comment = ({ commentId, postId, userId, avatar, name, lastname, nickname, rank, content }) => {
  const history = useHistory();
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token) || {};
  const [cmntContent, cmntImage] = getPostImage(content);

  const deleteComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await fetch(`http://localhost:8080/post/${postId}/comment/${commentId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
    });
    history.go(0);
  };

  return (
    <li>
      <article>
        <UserInfoHeader
          userId={userId}
          avatar={avatar}
          name={name}
          lastname={lastname}
          nickname={nickname}
          rank={rank}
        />
        <section>
          <p>{cmntContent}</p>
          {cmntImage ? <img src={cmntImage} alt={'Foto de la publicación'} /> : null}
          {decodedToken.userId === userId && <button className={'delete'} onClick={deleteComment} />}
        </section>
      </article>
    </li>
  );
};

export default Comment;
