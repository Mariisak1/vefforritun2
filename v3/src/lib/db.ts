import { readFile } from 'fs/promises';
import pg from 'pg';
import { DepartmentImport, Department, Course, CourseImport } from '../types.js';
import { departmentMapper, departmentsMapper, courseMapper, coursesMapper } from './mappers.js';
import { ParamsDictionary } from 'express-serve-static-core';
import dotenv from "dotenv";
import { getDepartment } from '../routes/departments.js';

dotenv.config();

const { DATABASE_URL: connectionString } = process.env;

const pool = new pg.Pool({ connectionString });

pool.on('error', (err: Error) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

type QueryInput = string | number | null | undefined;

export async function query(q: string, values: Array<QueryInput> = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    console.error('unable to query', e);
    console.info(q, values);
    return null;
  } finally {
    client.release();
  }
}

export async function end() {
  await pool.end();
}

export async function insertDepartment(
    department: Omit<Department, 'id'>
): Promise<Department | null> {

    const { title, slug, description } = department;
    const result = await query(
        'INSERT INTO department (title, slug, description) VALUES ($1, $2, $3) RETURNING id, title, slug, description, created, updated',
        [title, slug, description], 
    );

    if(!result) {
      return null;
    }

    const mapped = departmentMapper(result.rows[0]);

    return mapped;
}

export async function insertCourse(course: Omit<CourseImport, 'id'>, departmentId: number): Promise<Course | null> {
  const { title, course_id, classes, semester, level, url } = course;
  const result = await query(
    'INSERT INTO course (title, course_id, classes, department_id, semester, level, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
    [title, course_id, classes, departmentId, semester, level, url],
  );

  if(!result) {
    return null;
  }

  const mapped = courseMapper(result.rows[0]);

  return mapped;
}

export async function getAllDepartments(): Promise<Array<Department> | null> {
  const result = await query(
    'SELECT * FROM department'
  );

  if(!result) {
    return null;
  }

  if(!result.rows) {
    return null;
  }

  const departments = departmentsMapper(result);

  return departments;
}

export async function getAllCoursesWithinDept(depSlug: string): Promise<Array<Course> | null> {
  
  const department = await getDepartmentBySlug(depSlug);

  if(!department) {
    return null;
  }

  const { id } = department;
  
  const result = await query(
    'SELECT * FROM course WHERE department_id = $1',
    [id],
  );

  if(!result) {
    return null;
  }

  if(!result.rows) {
    return null;
  }

  const courses = coursesMapper(result);

  return courses;
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {

  const result = await query(
    'SELECT * FROM department WHERE slug = $1',
    [slug]
  );


  if(!result) {
    return null;
  }

  const department = departmentMapper(result.rows[0]);

  return department;
}

export async function deleteDepartmentBySlug(slug: string): Promise<boolean | null> {

  const department = await getDepartmentBySlug(slug);

  if(!department) {
    return null;
  }


  const result = await query(
    'DELETE FROM department WHERE slug = $1',
    [slug]
  );

  if(!result) {
    return false;
  }

  return true;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {

  const result = await query(
    'SELECT * FROM course WHERE course_id = $1',
    [slug]
  );

  if(!result) {
    return null;
  }

  const course = courseMapper(result.rows[0]);

  return course;
}

export async function deleteCourseBySlug(course_id: string): Promise<boolean | null> {

  const course = await getCourseBySlug(course_id);

  if(!course) {
    return null;
  }

  const result = await query(
    'DELETE FROM course WHERE course_id = $1',
    [course_id]
  );

  if(!result) {
    return false;
  }

  return true;
}