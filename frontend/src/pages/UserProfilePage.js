import { useState, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useParams } from 'react-router-dom';
import useUserProfile from '../hooks/useUserProfile';
import decodeTokenData from '../utils/decodeTokenData';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import ProfileContent from '../components/ProfileContent';
import List from '../components/List';
import Post from '../components/Post';
import RequestPopUp from '../components/RequestPopUp';

const ProfilePage = (props) => {
  let { userId } = useParams();
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token) || {};
  const mainUserRole = decodedToken.userRole || '';
  const [isProfileEditable, setIsProfileEditable] = useState(false);
  let isSelfProfile = false;

  if (!userId) {
    userId = decodedToken.userId;
    isSelfProfile = true;
  }

  const [userProfile] = useUserProfile(userId);

  return (
    <>
      <FixedBar />
      <main>
        <section className="profile">
          {userProfile.length < 1 ? (
            <p>El perfil no existe</p>
          ) : (
            <>
              <ProfileHeader
                name={userProfile.userInfo.usr_name}
                header={userProfile.userInfo.usr_header}
                avatar={userProfile.userInfo.usr_photo}
                followingCount={userProfile.userInfo.following_count}
                followersCount={userProfile.userInfo.followers_count}
                isSelfProfile={isSelfProfile}
              />
              <ProfileContent
                userId={userProfile.userInfo.usr_id}
                name={userProfile.userInfo.usr_name}
                lastname={userProfile.userInfo.usr_lastname}
                nickname={userProfile.userInfo.usr_nickname}
                email={userProfile.userInfo.usr_email}
                team={userProfile.userInfo.team_name || userProfile.userInfo.fav_team}
                teamId={userProfile.userInfo.team_id}
                about={userProfile.userInfo.usr_bio}
                tel={userProfile.userInfo.tel}
                province={userProfile.userInfo.province}
                profileUserRole={userProfile.userInfo.usr_role}
                mainUserRole={mainUserRole}
                isSelfProfile={isSelfProfile}
                isProfileEditable={isProfileEditable}
                setIsProfileEditable={setIsProfileEditable}
              />
              <List
                className={'postList'}
                data={userProfile.userPosts}
                render={(post) => (
                  <Post
                    key={post.post_id}
                    postId={post.post_id}
                    userId={post.usr_id}
                    avatar={userProfile.userInfo.usr_photo}
                    name={userProfile.userInfo.usr_name}
                    nickname={userProfile.userInfo.usr_nickname}
                    rank={userProfile.userInfo.usr_rank}
                    position={userProfile.userInfo.usr_position}
                    title={post.post_title}
                    content={post.post_content}
                  />
                )}
              />
            </>
          )}
        </section>
        <RequestPopUp playerId={userId} />
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default ProfilePage;
