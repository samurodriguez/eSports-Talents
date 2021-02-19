import Avatar from './Avatar';
import notificationActivityToText from '../utils/notificationsActivityToText.js';

const Notification = ({ avatar, name, lastname, activity, postContent, commentContent }) => {
  const activityText = notificationActivityToText(activity);

  return (
    <li>
      <article>
        <header>
          <Avatar avatar={avatar} name={name} />
          <h2>
            {`${name} ${lastname} `}
            <span>{activityText}</span>
          </h2>
        </header>
        <section>
          {activity === 'postLike' ? <p>{postContent}</p> : activity === 'postComment' ? <p>{commentContent}</p> : null}
        </section>
      </article>
    </li>
  );
};

export default Notification;
