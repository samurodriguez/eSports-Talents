import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import List from '../components/List';
import Post from '../components/Post';
import Comment from '../components/Comment';
import CommentPopUp from '../components/CommentPopUp';

const PostPage = (props) => {
  const [postWithComments, setPostWithComments] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    const getPostById = async () => {
      const res = await fetch(`http://localhost:8080/post/${postId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const post = await res.json();
      setPostWithComments(post);
    };

    getPostById();
  }, [postId]);

  return (
    <>
      <FixedBar />
      <main>
        <section className={'postWithComments'}>
          {postWithComments.length < 1 ? (
            <p>El post no existe</p>
          ) : (
            <>
              <List
                className={'postList'}
                data={postWithComments.post}
                render={(post) => (
                  <Post
                    key={post.post_id}
                    postId={post.post_id}
                    userId={post.usr_id}
                    avatar={post.usr_photo}
                    name={post.usr_name}
                    nickname={post.usr_nickname}
                    rank={post.usr_rank}
                    position={post.usr_position}
                    title={post.post_title}
                    content={post.post_content}
                    userSharing={post.usr_sharing}
                  />
                )}
              />
              {postWithComments.comments.length > 0 && (
                <List
                  className={'commentList'}
                  data={postWithComments.comments}
                  render={(comment) => (
                    <Comment
                      key={comment.cmnt_id}
                      commentId={comment.cmnt_id}
                      postId={comment.post_replied}
                      userId={comment.usr_id}
                      avatar={comment.usr_photo}
                      name={comment.usr_name}
                      lastname={comment.usr_lastname}
                      nickname={comment.usr_nickname}
                      rank={comment.usr_rank}
                      content={comment.cmnt_content}
                    />
                  )}
                />
              )}
            </>
          )}
        </section>
        <CommentPopUp postId={postId} />
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default PostPage;
