import { Link } from 'react-router-dom';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import List from '../components/List';
import Post from '../components/Post';
import PostWriter from '../components/PostWriter';
import useRemotePosts from '../hooks/useRemotePosts';
import { useState } from 'react';
import CommentPopUp from '../components/CommentPopUp';
import RedirectIfNotLoggedIn from '../components/RedirectIfNotLoggedIn';

const HomePage = () => {
  const [posts] = useRemotePosts();
  const [postId, setPostId] = useState('');

  return (
    <>
      <RedirectIfNotLoggedIn />
      <FixedBar />
      <main>
        <PostWriter />
        {posts.length < 1 ? (
          <section className="emptyHome">
            <p>Oops! No hay publicaciones en tu muro.</p>
            <p>
              Echa un vistazo en <Link to="/explore">explorar, ¡seguro que hay perfiles que te interesan!</Link>
            </p>
          </section>
        ) : (
          <List
            className={'postList'}
            data={posts}
            render={(post) => (
              <Post
                key={post.post_id}
                postId={post.post_id}
                userId={post.usr_id}
                avatar={post.usr_photo}
                name={post.usr_name}
                lastName={post.usr_lastname}
                nickname={post.usr_nickname}
                rank={post.usr_rank}
                position={post.usr_position}
                title={post.post_title}
                content={post.post_content}
                userSharing={post.usr_sharing}
                setPostId={setPostId}
              />
            )}
          />
        )}
        <CommentPopUp postId={postId} />
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default HomePage;
