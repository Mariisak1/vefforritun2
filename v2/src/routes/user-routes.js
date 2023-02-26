import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import {
  createEvent,
  listEvent,
  listEventByName,
  listEvents,
  updateEvent,
} from '../lib/db.js';
import passport, { ensureLoggedInUser } from '../lib/login.js';
import { slugify } from '../lib/slugify.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from '../lib/validation.js';

import { createUser } from '../lib/users.js';

export const userRouter = express.Router();

async function userRoute(req, res) {
  const events = await listEvents();
  const { user: { username } = {} } = req || {};

  return res.render('user', {
    username,
    errors: [],
    title: 'Viðburðir — notandi',
    admin: false,
    events,
  });
}

function login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/user');
    }
  
    let message = '';
  
    // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
    // og hreinsum skilaboð
    if (req.session.messages && req.session.messages.length > 0) {
      message = req.session.messages.join(', ');
      req.session.messages = [];
    }
  
    return res.render('loginUser', { message, title: 'Innskráning' });
}

function signup(req, res) {

  console.log(req);

  //TODO IF USER DOES NOT EXIST THEN CALL "createUser"
  if (req.isAuthenticated()) {
    return res.redirect('/user');
  }



  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('signup-user', { message, title: 'Nýskráning' });
}


userRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

userRouter.get('/', ensureLoggedInUser, catchErrors(userRoute));
userRouter.get('/login', login);
userRouter.get('/signup', signup);

userRouter.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/user/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /user
  (req, res) => {
    res.redirect('/user');
  }
);

userRouter.post(
  '/signup', 
  
  async (req, res) => {

  const { username, password } = req.body;

  try {
    await createUser(username, password);

    //Skráir notanda sjálfkrafa inn eftir sign-up
    passport.authenticate('local')(req, res, () => {
      res.redirect('/user');
    });
  } 
  
  catch(error) {
    return res.render('user/signup')
  }

}
);