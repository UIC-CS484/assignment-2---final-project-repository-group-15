// This export can be used as a middleware in any route where we want to ensure auth-protected access
module.exports = {
    ensureAuthenticated: function(req, res, next){
        // req.isAuthenticated() is a method given by passport that tells if the request is authenticated.
        // Using this we are checking if request is authenticated.
        if(req.isAuthenticated()) {
            // If authenticated then continue to next
            return next();
        }
        // Else, display a flash error
        req.flash('error_msg', 'Please login to view this resource')
        // And, redirect to login page.
        res.redirect('/users/login')
    }
}