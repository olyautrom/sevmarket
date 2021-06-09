module.exports = function(req, res, next) {
  if ((req.session.admin.role === 'editor') || !(req.session.admin.role === 'admin')) {
    return res.redirect('/admin');
  }
  next();
}