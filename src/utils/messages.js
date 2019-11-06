const generateMessage = (username, text) => {
   return {
      username,
      text,
      createdAt: new Date().getTime()
   };
};

const generateLocationMessage = (username, geodata) => {
   return {
      username,
      url: `https://google.com/maps?q=${geodata.latitude},${geodata.longitude}`,
      createdAt: new Date().getTime()
   };
};

module.exports = {
   generateMessage,
   generateLocationMessage
};
