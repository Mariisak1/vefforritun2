import express, { Request, Response, NextFunction } from 'express';
import { sayHello } from '../lib/hello.js';
import { createDepartment, showAllDepartments, getDepartment, deleteDepartment } from './departments.js';

export const router = express.Router();

export async function hello(req: Request, res: Response, next: NextFunction) {
  res.json({ hello: sayHello('world') });
  next();
}

export async function index(req: Request, res: Response, next: NextFunction) {
  return res.json([
    {
      href: '/departments',
      methods: ['GET', 'POST'],
    },
    {
      href: '/departments/:slug',
      methods: ['GET', 'DELETE', 'PATCH'],
    },
    {
      href: '/departments/:slug/courses',
      methods: ['GET', 'POST'],
    },
    {
      href: '/departments/:slug/courses/:slug',
      methods: ['GET', 'DELETE', 'PATCH'],
    },
  ]);
}




//index
router.get('/', index);

//departments
router.get('/departments', showAllDepartments);
router.post('/departments', createDepartment);
router.get('/departments/:slug', getDepartment);
router.delete('/departments/:slug', deleteDepartment);


router.get('/test', hello);

