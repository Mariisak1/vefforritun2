import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { listEvent, listEvents, listRegistered, register, getEventCount, getEventsByPage } from '../lib/db.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from '../lib/validation.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  // const events = await listEvents();
  const perPage = 9;
  const page = req.params.page || 1;
  const offset = (page - 1) * perPage;
  const events = await getEventsByPage(offset, perPage);
  const eventCount = await getEventCount();
  const pageCount = Math.ceil(eventCount.rows[0].count / perPage);

  res.render('index', {
    title: 'Viðburðasíðan',
    admin: false,
    events,
    current: page,
    pages: pageCount,
  });
}

async function eventRoute(req, res, next) {
  const { slug } = req.params;
  const event = await listEvent(slug);

  if (!event) {
    return next();
  }

  const registered = await listRegistered(event.id);

  return res.render('event', {
    title: `${event.name} — Viðburðasíðan`,
    event,
    registered,
    errors: [],
    data: {},
    user: req.user,
  });
}

async function eventRegisteredRoute(req, res) {
  const events = await listEvents();

  res.render('registered', {
    title: 'Viðburðasíðan',
    events,
  });
}

async function validationCheck(req, res, next) {
  const { name, comment } = req.body;

  const { slug } = req.params;
  const event = await listEvent(slug);
  const registered = await listRegistered(event.id);

  const data = {
    name,
    comment,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.render('event', {
      title: `${event.name} — Viðburðasíðan`,
      data,
      event,
      registered,
      errors: validation.errors,
    });
  }

  return next();
}

//registers user for an event
async function registerRoute(req, res) {
  const { name, comment } = req.body;
  const { slug } = req.params;
  const event = await listEvent(slug);

  if(!req.isAuthenticated()) {
    return res.redirect('/user/login');
  }

  const registered = await register({
    name,
    comment,
    event: event.id,
    the_user: req.user.id,
  });


  if (registered) {
    return res.redirect(`/${event.slug}`);
  }

  return res.render('error');
}


indexRouter.get('/:slug', catchErrors(eventRoute));

indexRouter.post(
  '/:slug',
  registrationValidationMiddleware('comment'),
  xssSanitizationMiddleware('comment'),
  catchErrors(validationCheck),
  sanitizationMiddleware('comment'),
  catchErrors(registerRoute)
  );
  indexRouter.get('/:slug/thanks', catchErrors(eventRegisteredRoute));
  

  indexRouter.get('/:page?', catchErrors(indexRoute));