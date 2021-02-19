function getPostImage(text) {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]\.(?:png|jpg))/gi;
  const postContent = text.replace(urlRegex, () => '');
  const imgSrc = text.match(urlRegex);

  return [postContent, imgSrc];
}

export default getPostImage;
