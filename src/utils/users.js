const users = [];

const addUser = ({ username, room, id }) => {
  //clean data

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room)
    return {
      error: "Username and room is required",
    };

  //check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //validate user
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  /// store user

  const user = {
    id,
    username,
    room,
  };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return undefined;
  }
  return user;
};

const getUserInRoom = (room) => {
  const user = users.filter((user) => user.room === room);
  if (!user) {
    return [];
  }
  return user;
};

module.exports = { getUser, getUserInRoom, removeUser, addUser };
