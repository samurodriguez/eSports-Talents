const notificationActivityToText = (activity) => {
  const activitySummary = {
    follow: 'te siguió',
    postLike: 'le ha dado me gusta a tu publicación',
    postComment: 'comentó tu publicación',
    request: 'te ha enviado una solicitud de contratación',
  };

  return activitySummary[activity];
};

export default notificationActivityToText;
