import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import decodeTokenData from '../utils/decodeTokenData';
import TeamProfilePage from './TeamProfilePage';
import UserProfilePage from './UserProfilePage';

const ProfilePage = () => {
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token) || {};

  return <>{decodedToken.teamId ? <TeamProfilePage /> : <UserProfilePage />}</>;
};

export default ProfilePage;
