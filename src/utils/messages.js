const generateMessage = (username, text) => {
  return {
    username,
    text: text,
    createdAt: new Date().getTime(),
  };
};
const generateLocationMessage = (username, url) => {
  return {
    username: username,
    url: url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage: generateMessage,
  generateLocationMessage: generateLocationMessage,
};
