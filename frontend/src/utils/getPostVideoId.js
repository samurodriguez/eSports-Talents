function getPostVideoId(text) {
  const getYoutubeUrl = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;
  const postContent = text.replace(getYoutubeUrl, () => '');
  const videoUrl = text.match(getYoutubeUrl);
  const arrayOfParams = `${videoUrl}`.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );

  let videoId = null;
  if (arrayOfParams) {
    videoId = arrayOfParams[1].split(',');
  }

  return [postContent, videoId];
}

export default getPostVideoId;
