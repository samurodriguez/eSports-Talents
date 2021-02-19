import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const useRemoteNotifications = () => {
  const [token] = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const res = await fetch(`http://localhost:8080/notifications`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `${token}`,
        },
      });

      const fetchedNotifications = await res.json();
      setNotifications(fetchedNotifications);
    };

    getNotifications();
    let interval = setInterval(() => getNotifications(), 50000);

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  return [notifications, setNotifications];
};

export default useRemoteNotifications;
