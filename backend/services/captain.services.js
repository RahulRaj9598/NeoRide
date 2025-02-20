const captainModel = require('../models/captain.model');

module.exports.createCaptain = async (captainData) => {
  const { fullname, email, password, vehicle } = captainData;

  if (!fullname.firstname || !email || !password || 
      !vehicle.color || !vehicle.plate || 
      !vehicle.capacity || !vehicle.vehicleType) {
    throw new Error('All fields are required');
  }

  const captain = await captainModel.create({
    fullname,
    email,
    password,
    vehicle
  });

  return captain;
}
