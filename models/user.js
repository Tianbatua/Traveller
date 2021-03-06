const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Validate Email
let emailLengthChecker = (email) => {
  if (!email){
    return false;
  } else {
    if (email.length < 5 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

let validEmailChecker = (email) => {
  if(!email) {
    return false;
  } else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

const emailValidators = [
  {
    validator: emailLengthChecker,
    message: 'Email must be at least 5 charcters but no more than 30'
  },
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Validate username
let usernameLengthChecker = (username) => {
  if (!username){
    return false;
  } else {
    if (username.length < 3 || username.length > 15) {
      return false;
    } else {
      return true;
    }
  }
};

let validUsername = (username) => {
  if (!username) {
    return false;
  } else {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'username must be at least 3 charcters but no more than 15'
  },
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];

// Validate Password
let pwdLengthChecker = (password) => {
  if (!password){
    return false;
  } else {
    if (password.length < 8 || password.length > 35) {
      return false;
    } else {
      return true;
    }
  }
};

let validPassword = (password) => {
  if (!password) {
    return false;
  } else {
    const regExp = new RegExp(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,35}$/);
    return regExp.test(password);
  }
};

const passwordValidators = [
  {
    validator: pwdLengthChecker,
    message: 'password must be at least 8 charcters but no more than 35'
  },
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

const userSchema = new Schema({
  email:  { type: String, required: true, unique: true, lowercase:true, validate: emailValidators },
  username:  { type: String, required: true, unique: true, lowercase:true, validate: usernameValidators },
  password: { type: String, require: true, validate: passwordValidators}
});

// Schema Middleware to Encrypt password
userSchema.pre('save', function(next){
  // Ensure password is new or modified before applying encryption
  if(!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if(err) 
      return next(err); // Ensure no err
    this.password = hash; //Apply encryption to password
    next(); //Exit middleware
  });
});


// Methods to compare password to encrypted password upon Login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);
