const Info = require('../models/info');

module.exports = async function(req, res, next) {
  res.locals.phone = (await Info.findOne({ infoId: 'phone' })).value;
  res.locals.email = (await Info.findOne({ infoId: 'email' })).value;
  res.locals.address = (await Info.findOne({ infoId: 'address' })).value;
  res.locals.instagram = (await Info.findOne({ infoId: 'instagram' })).value;
  res.locals.facebook = (await Info.findOne({ infoId: 'facebook' })).value;
  res.locals.telegram = (await Info.findOne({ infoId: 'telegram' })).value;
  res.locals.whatsapp = (await Info.findOne({ infoId: 'whatsapp' })).value;
  res.locals.textFooter = (await Info.findOne({ infoId: 'textFooter' })).value;
  res.locals.logoMain = (await Info.findOne({ infoId: 'logoMain' })).value;
  res.locals.logoFixed = (await Info.findOne({ infoId: 'logoFixed' })).value;
  res.locals.logoFooter = (await Info.findOne({ infoId: 'logoFooter' })).value;

  next()
}