const isLoggedIn = (req, res, next) => {
    //console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }

    next()
}
module.exports = isLoggedIn