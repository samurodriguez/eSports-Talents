import Avatar from './Avatar';
import rankNumberToName from '../utils/rankNumberToName';
import { Link } from 'react-router-dom';

const UserInfoHeader = ({ userId, avatar, name, lastname, nickname, rank, position }) => {
  let className = 'userInfoHeader';
  if (position || rank) {
    className = 'playerHeader';
  }

  return (
    <>
      <Link to={`/user/${userId}`}>
        <header className={className}>
          <Avatar avatar={avatar} name={name} editable={true} />
          <h2>
            {name} {lastname}
          </h2>
          <h3>{`@${nickname}`}</h3>
          {rank && <p>{rankNumberToName(rank)}</p>}
          {position && (
            <img
              className={'position'}
              src={`/assets/positions/${position}.png`}
              alt={`Imagen de la posición ${position}`}
            />
          )}
        </header>
      </Link>
    </>
  );
};

export default UserInfoHeader;
