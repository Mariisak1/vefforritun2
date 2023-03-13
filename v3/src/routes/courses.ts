import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { deleteCourseBySlug, getAllCoursesWithinDept, getDepartmentBySlug, insertCourse, getCourseBySlug } from "../lib/db.js";
import { DepartmentImport, Department, Course, CourseImport } from '../types.js';


export async function showAllCoursesWithinDept(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    const courses = await getAllCoursesWithinDept(slug);

    if(!courses) {
        return next(new Error('unable to get courses within department'));
    }

    return res.json(courses);
}

export async function getCourse(req: Request, res: Response, next: NextFunction) {
    const { course_id } = req.params;

    const course = await getCourseBySlug(course_id);

    if(!course) {
        return next();
    }

    return res.json(course);
}

//kannski sniðugra að hafa þetta sem handler og láta db.ts um lógíkina
export async function createCourseWithinDept(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return next(new Error('missing request body'));
    }

    const { slug } = req.params;

    const department = await getDepartmentBySlug(slug);

    if(!department) {
        return null;
    }

    const { id, title: dep_title } = department;

    const { course_id, title, classes, semester } = req.body;

    const course: Omit<Course, 'id'> = {
        course_id,
        title,
        department_id: id,
        classes,
        semester,
    };

    const createdCourse = await insertCourse(course, id);

    if(!createdCourse) {
        return next(new Error(`unable to create the course within ${dep_title}`));
    }

    return res.status(201).json(createdCourse);

}

export async function deleteCourseWithinDept(req: Request, res: Response, next: NextFunction) {
    const { course_id } = req.params;

    const result = await deleteCourseBySlug(course_id);

    if(result === null) {
        return next();
    }

    if(!result) {
        return next(new Error('failed to delete course'));
    }

    return res.status(204).send();
}


