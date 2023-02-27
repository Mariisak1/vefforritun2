/* eslint-disable camelcase */  
import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import {
  deleteRegistration,
  getEventCount,
  getEventsByPage
} from '../lib/db.js';
import passport, { ensureLoggedInUser } from '../lib/login.js';

import { createUser } from '../lib/users.js';

export const userRouter = express.Router();

async function userRoute(req, res) {
  const perPage = 9;
  const page = req.params.page || 1;
  const offset = (page - 1) * perPage;
  const events = await getEventsByPage(offset, perPage);
  const eventCount = await getEventCount();
  const pageCount = Math.ceil(eventCount.rows[0].count / perPage);

  const { user: { username } = {} } = req || {};

  return res.render('user', {
    username,
    errors: [],
    title: 'Viðburðir — notandi',
    admin: false,
    events,
    current: page,
    pages: pageCount,
  });
}

function login(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/user');
    }
  
    let message = '';
  
    if (req.session.messages && req.session.messages.length > 0) {
      message = req.session.messages.join(', ');
      req.session.messages = [];
    }
  
    return res.render('loginUser', { message, title: 'Innskráning' });
}

function signup(req, res) {

  if (req.isAuthenticated()) {
    return res.redirect('/user');
  }

  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('signup-user', { message, title: 'Nýskráning' });
}

// eyðir registration
async function deleteRegistrationRoute(req, res) {
  const the_user = req.user.id;
  const { slug, id } = req.params;

  try {
    await deleteRegistration(id, the_user);
    res.redirect(`/${slug}`);
  }
  catch(error){
    console.error(error);
  }
}


userRouter.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/');
});

userRouter.get('/', ensureLoggedInUser, catchErrors(userRoute));
userRouter.get('/login', login);
userRouter.get('/signup', signup);
userRouter.get('/:slug/delete/:id', deleteRegistrationRoute);

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

    passport.authenticate('local')(req, res, () => 
      res.redirect('/user')
    );
  } 
  
  catch(error) {
    return res.render('user/signup')
  }

  return null;
});