import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory, Link } from 'react-router-dom';
import useFollowCheck from '../hooks/useFollowCheck';
import LocationIcon from '../images/location_icon.png';
import decodeTokenData from '../utils/decodeTokenData';
import UpdateTeamForm from './UpdateTeamForm';
import UpdateUserForm from './UpdateUserForm';

const ProfileContent = ({
  userId,
  name,
  email,
  lastname,
  nickname,
  team,
  teamId,
  about,
  foundationDate,
  tel,
  province,
  profileUserRole,
  mainUserRole,
  isSelfProfile,
  isProfileEditable,
  setIsProfileEditable,
}) => {
  const history = useHistory();
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token);
  const [doesUserFollowUser, setFollowCheck] = useFollowCheck(userId);

  const follow = async (e) => {
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/user/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setFollowCheck(1);
    }
  };

  const unfollow = async (e) => {
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      await fetch(`http://localhost:8080/user/${userId}/unfollow`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });
      setFollowCheck(0);
    }
  };

  const openRequestPopUp = async (e) => {
    e.preventDefault();
    if (!decodedToken.userId) {
      console.error('Usuario no autorizado para realizar esta acción');
      history.push('/login');
    } else {
      const rootDiv = document.getElementById('root');
      const requestPopUp = document.getElementById('requestPopUp');
      const body = document.querySelector('body');

      rootDiv.classList.toggle('blurred');
      requestPopUp.classList.toggle('hidden');
      body.classList.toggle('scrollDisabled');
    }
  };

  return (
    <section className={'profileContent'}>
      {!isProfileEditable ? (
        <>
          <h2>{`${name} ${lastname || ''}`}</h2>
          {nickname && <h3>{nickname}</h3>}
          {team && teamId ? (
            <Link to={`/team/${teamId}`}>
              <p className={'userTeam'}>{team}</p>
            </Link>
          ) : (
            team && <p className={'userTeam'}>{team}</p>
          )}
          {about && <p className={'userAbout'}>{about}</p>}
          {province && (
            <>
              <img src={LocationIcon} alt={'Icono de localización'} />
              <p className={'userProvince'}>{province}</p>
            </>
          )}
          <div className={'buttonsWrapper'}>
            {isSelfProfile || decodedToken.teamId ? null : profileUserRole ? (
              profileUserRole && doesUserFollowUser ? (
                <button className={'follow'} onClick={unfollow}>
                  Unfollow
                </button>
              ) : (
                <button className={'follow'} onClick={follow}>
                  Follow
                </button>
              )
            ) : null}
            {mainUserRole === 'scout' && profileUserRole === 'player' && (
              <button className={'request'} onClick={openRequestPopUp}>
                Solicitar contratación
              </button>
            )}
            {isSelfProfile && <button className={'editProfile'} onClick={() => setIsProfileEditable(true)} />}
          </div>
        </>
      ) : profileUserRole === 'team' ? (
        <UpdateTeamForm
          token={token}
          teamId={userId}
          oldName={name}
          oldEmail={email}
          oldFoundationDate={foundationDate}
          oldProvince={province}
          oldTel={tel}
          oldAbout={about}
          setIsProfileEditable={setIsProfileEditable}
        />
      ) : (
        <UpdateUserForm
          token={token}
          role={profileUserRole}
          userId={userId}
          oldName={name}
          oldLastname={lastname}
          oldEmail={email}
          oldNickname={nickname}
          oldProvince={province}
          oldTel={tel}
          oldAbout={about}
          oldFavTeam={team}
          setIsProfileEditable={setIsProfileEditable}
        />
      )}
    </section>
  );
};

export default ProfileContent;
