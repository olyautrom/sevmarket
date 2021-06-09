module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.csrf = req.csrfToken();
    if (req.session.admin) {
        if (req.session.admin.role === 'admin') {
            res.locals.isAdmin = true;
            res.locals.isEditor = false;
        } else {
            res.locals.isAdmin = false;
            res.locals.isEditor = true;
        }
    }
    next();
}