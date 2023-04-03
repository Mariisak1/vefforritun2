import express, { Request, Response, NextFunction } from 'express';
import { sayHello } from '../lib/hello.js';
import { showAllCoursesWithinDept, createCourseWithinDept, deleteCourseWithinDept, getCourse } from './courses.js';
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
      href: '/departments/:slug/courses/:course_id',
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

//courses
router.get('/departments/:slug/courses', showAllCoursesWithinDept);
router.post('/departments/:slug/courses', createCourseWithinDept);
//slug breytir engu, laga
router.get('/departments/:slug/courses/:course_id', getCourse);
router.delete('/departments/:slug/courses/:course_id', deleteCourseWithinDept);




router.get('/test', hello);

