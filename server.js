// USE DOTENV TO IMPORT
require('dotenv').config();

//Dependencies
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const app = express();
const session = require('express-session')
const User = require('./models/users')
const Things = require('./models/things')

// Configuration
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use( express.static ( 'public' ) );
app.use(methodOverride('_method'));
// parses info
app.use(express.urlencoded({extended: false}));
// configure sessions
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))


// DAtabase config and connection
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoURI, { useNewUrlParser: true})
mongoose.connection.once('open', () => {
  console.log('connected to mongo')
});

// Listen
app.listen(PORT, ()=> console.log('auth happening on port'),( PORT))

// ============================
// GET ROUTES
// ============================
// -- index route
app.get('/', (req, res) => {
  // res.send('index route')
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/main', (req, res) => {
  User.findOne({_id: req.session.currentUser._id}, (err, edituser) => {
  res.render('main.ejs', {
      currentUser: edituser
  })
})
})




// ============================
// ACTION ROUTES
// ============================
// -- Add todo Things in User's thing array
app.post('/main', (req, res)=>{
    Things.create(req.body, (err, createdThings)=>{
      User.findOneAndUpdate({_id: req.session.currentUser._id}, {$push: {things: createdThings}}, (err, data) =>{
        res.redirect('/main');
        });
    });
});

app.delete('/main/:id', (req, res) => {
    User.update({ things: res.params.id }, {$pull:{things: res.params.id}})

    me.save(function(err,us){
      res.redirect('/main');
});
});






// users controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
