async function getUserSharingName(userId) {
  const res = await fetch(`http://localhost:8080/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const user = await res.json();
  const name = user.userInfo.usr_name;
  const lastname = user.userInfo.usr_lastname;

  return name + lastname;
}

export default getUserSharingName;
