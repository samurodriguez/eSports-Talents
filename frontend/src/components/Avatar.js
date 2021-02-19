const Avatar = ({ avatar, name }) => {
  return (
    <img
      className={'avatar'}
      src={`http://localhost:8080/${avatar || 'defaultAvatar.png'}`}
      alt={`Avatar de ${name}`}
    />
  );
};

export default Avatar;
