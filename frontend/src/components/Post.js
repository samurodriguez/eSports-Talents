import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { Link, useHistory } from 'react-router-dom';
import useLikeCheck from '../hooks/useLikeCheck';
import useShareCheck from '../hooks/useShareCheck';
import getPostImage from '../utils/getPostImage';
import getPostVideoId from '../utils/getPostVideoId';
import UserInfoHeader from './UserInfoHeader';
import useUserSharingName from '../hooks/useUserSharingName';
import decodeTokenData from '../utils/decodeTokenData';
import SharedIcon from '../images/unshare_icon.png';

const Post = ({
  postId,
  userId,
  avatar,
  name,
  lastname,
  nickname,
  rank,
  position,
  title,
  content,
  userSharing,
  setPostId,
}) => {
  const history = useHistory();
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token) || {};
  const [postContentWithoutImage, postImage] = getPostImage(content);
  const [postContentWithoutVideo, videoId] = getPostVideoId(postContentWithoutImage);
  const [userSharingName] = useUserSharingName(userSharing);
  const [doesUserLikePost, setLikeCheck] = useLikeCheck(postId);
  const [doesUserSharePost, setShareCheck] = useShareCheck(postId);

  const userLikes = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/post/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setLikeCheck(1);
    }
  };

  const userUnlikes = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/post/${postId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
    }
    setLikeCheck(0);
  };

  const userComments = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      const rootDiv = document.getElementById('root');
      const commentPopUp = document.getElementById('commentPopUp');
      const body = document.querySelector('body');

      rootDiv.classList.toggle('blurred');
      commentPopUp.classList.toggle('hidden');
      body.classList.toggle('scrollDisabled');
      if (setPostId) {
        setPostId(postId);
      }
    }
  };

  const userShares = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/post/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setShareCheck(1);
      history.go(0);
    }
  };

  const userUnshares = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/post/${postId}/unshare`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setShareCheck(0);
      history.go(0);
    }
  };

  const deletePost = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await fetch(`http://localhost:8080/post/${postId}/delete`, {
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
        {userSharing && (
          <>
            <img src={SharedIcon} alt={'Icono de compartir'} />
            <p>{userSharing === decodedToken.userId ? 'Has' : `${userSharingName} ha`} compartido esta publicación</p>
          </>
        )}
        <UserInfoHeader
          userId={userId}
          avatar={avatar}
          name={name}
          lastname={lastname}
          nickname={nickname}
          rank={rank}
          position={position}
        />
        <section>
          <Link to={`/post/${postId}`}>
            <h2>{title}</h2>
            <p>{postContentWithoutVideo}</p>

            {postImage && <img src={postImage} alt={'Foto de la publicación'} />}
            {videoId && (
              <iframe
                title={`Vídeo de ${name}`}
                src={`https://www.youtube.com/embed/${videoId[1]}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            <div className="buttonWrapper">
              {decodedToken.teamId ? null : decodedToken.userId ? (
                doesUserLikePost ? (
                  <button className={'unlike'} onClick={userUnlikes} />
                ) : (
                  <button className={'like'} onClick={userLikes} />
                )
              ) : (
                <button className={'like'} onClick={userLikes} />
              )}
              {decodedToken.teamId ? null : decodedToken.userId ? (
                doesUserSharePost ? (
                  <button className={'unshare'} onClick={userUnshares} />
                ) : (
                  <button className={'share'} onClick={userShares} />
                )
              ) : (
                <button className={'share'} onClick={userShares} />
              )}
              {decodedToken.teamId ? null : <button className={'comment'} onClick={userComments} />}
              {decodedToken.userId === userId && <button className={'delete'} onClick={deletePost} />}
            </div>
          </Link>
        </section>
      </article>
    </li>
  );
};

export default Post;
