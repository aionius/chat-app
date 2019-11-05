const generateMessage = text => {
   return {
      text,
      createdAt: new Date().getTime()
   };
};

const generateLocationMessage = geodata => {
   return {
      url: `https://google.com/maps?q=${geodata.latitude},${geodata.longitude}`,
      createdAt: new Date().getTime()
   };
};

module.exports = {
   generateMessage,
   generateLocationMessage
};
