const isLoggedIn = (req, res, next) => {
    //console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {
        return res.redirect('/pennywise/user/login')
    }

    next()
}
module.exports = isLoggedIn