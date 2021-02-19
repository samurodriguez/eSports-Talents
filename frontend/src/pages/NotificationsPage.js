import useRemoteNotifications from '../hooks/useRemoteNotifications';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import List from '../components/List';
import Notification from '../components/Notification';
import RedirectIfNotLoggedIn from '../components/RedirectIfNotLoggedIn';

const NotificationsPage = (props) => {
  const [notifications] = useRemoteNotifications();

  return (
    <>
      <RedirectIfNotLoggedIn />
      <FixedBar />
      <main>
        <section className="notifications">
          {notifications.length < 1 ? (
            <p className={'emptyNotifications'}>No hay notificaciones</p>
          ) : (
            <List
              className={'notificationsList'}
              data={notifications}
              render={(notification) => (
                <Notification
                  key={notification.noti_id}
                  avatar={notification.usr_photo}
                  name={notification.usr_name}
                  lastname={notification.usr_lastname}
                  activity={notification.activity_type}
                  postContent={notification.post_content}
                  commentContent={notification.cmnt_content}
                />
              )}
            />
          )}
        </section>
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default NotificationsPage;
