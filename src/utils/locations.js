const generateLocation = geodata => {
   return {
      url: `https://google.com/maps?q=${geodata.latitude},${geodata.longitude}`,
      createdAt: new Date().getTime()
   };
};

module.exports = {
   generateLocation
};
