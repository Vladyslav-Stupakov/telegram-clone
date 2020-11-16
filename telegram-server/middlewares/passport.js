import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt'
import User from '../models/userModel.js';

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    (email, password, cb) => {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return cb(err, null)
            }
            if (!user) {
                return cb(null, false)
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return err
                }
                else {
                    if(result){
                        return cb(null, user);
                    }
                    else{
                        return cb(null, false)
                    }
                }
            });
        })
    }));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

export default passport