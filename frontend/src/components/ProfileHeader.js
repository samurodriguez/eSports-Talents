import EditableAvatar from './EditableAvatar';
import EditableHeader from './EditableHeader';
import Avatar from './Avatar';

const ProfileHeader = ({ name, header, avatar, followingCount, followersCount, isSelfProfile }) => {
  return (
    <section className={'profileHeader'}>
      {isSelfProfile ? (
        <EditableHeader header={header} name={name} />
      ) : (
        <header>
          <img src={`http://localhost:8080/${header || 'defaultHeader.jpg'}`} alt={`Header de ${name}`} />
        </header>
      )}

      {isSelfProfile ? <EditableAvatar avatar={avatar} name={name} /> : <Avatar avatar={avatar} name={name} />}
      <section className={'followers'}>
        {(followingCount || followingCount === 0) && (
          <p>
            {`${followingCount} `}
            <span>seguidos</span>
          </p>
        )}
        {(followersCount || followersCount === 0) && (
          <p>
            {`${followersCount} `}
            <span>seguidores</span>
          </p>
        )}
      </section>
    </section>
  );
};

export default ProfileHeader;
