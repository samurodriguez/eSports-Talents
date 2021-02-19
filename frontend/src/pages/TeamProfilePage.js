import { useState, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useParams } from 'react-router-dom';
import useTeamProfile from '../hooks/useTeamProfile';
import decodeTokenData from '../utils/decodeTokenData';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import List from '../components/List';
import UserInfoHeader from '../components/UserInfoHeader';
import ProfileContent from '../components/ProfileContent';

const ProfilePage = (props) => {
  let { teamId } = useParams();
  const [token] = useContext(AuthContext);
  const [isProfileEditable, setIsProfileEditable] = useState(false);
  let isSelfProfile = false;

  if (!teamId) {
    const decodedToken = decodeTokenData(token);
    teamId = decodedToken.teamId;
    isSelfProfile = true;
  }

  const [teamProfile] = useTeamProfile(teamId);

  const kickPlayer = async (e, userId) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/team/${teamId}/update`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        playerToRemove: `${userId}`,
      }),
    });
  };

  return (
    <>
      <FixedBar />
      <main>
        <section className="profile">
          {teamProfile.length < 1 ? (
            <p>El perfil no existe</p>
          ) : (
            <>
              <ProfileHeader
                name={teamProfile.teamInfo.team_name}
                header={teamProfile.teamInfo.team_header}
                avatar={teamProfile.teamInfo.team_logo}
                isSelfProfile={isSelfProfile}
              />
              <ProfileContent
                userId={teamProfile.teamInfo.team_id}
                name={teamProfile.teamInfo.team_name}
                email={teamProfile.teamInfo.team_email}
                foundationDate={teamProfile.teamInfo.foundation_date}
                tel={teamProfile.teamInfo.tel}
                province={teamProfile.teamInfo.province}
                about={teamProfile.teamInfo.team_bio}
                profileUserRole={'team'}
                isSelfProfile={isSelfProfile}
                isProfileEditable={isProfileEditable}
                setIsProfileEditable={setIsProfileEditable}
              />
              <section className={'teamPlayers'}>
                <h2>Jugadores</h2>
                <List
                  className={'teamPlayersList'}
                  data={teamProfile.teamPlayers}
                  render={(player) => (
                    <li key={player.usr_id}>
                      <UserInfoHeader
                        userId={player.usr_id}
                        avatar={player.usr_photo}
                        name={player.usr_name}
                        lastname={player.usr_lastname}
                        nickname={player.usr_nickname}
                        rank={player.usr_rank}
                        position={player.usr_position}
                      />
                      {isProfileEditable && <button className="delete" onClick={(e) => kickPlayer(e, player.usr_id)} />}
                    </li>
                  )}
                />
              </section>
            </>
          )}
        </section>
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default ProfilePage;
