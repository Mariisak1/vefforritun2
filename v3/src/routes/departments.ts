import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { getAllDepartments, insertDepartment, getDepartmentBySlug, deleteDepartmentBySlug } from '../lib/db.js';
import { DepartmentImport, Department, Course, CourseImport } from '../types.js';


export async function showAllDepartments(req: Request, res: Response, next: NextFunction) {
    const departments = await getAllDepartments();

    if(!departments) {
        return next(new Error('unable to get departments'));
    }

    return res.json(departments);
}

export async function createDepartment(req: Request, res: Response, next: NextFunction) {

    console.log(req.body);

    if (!req.body) {
        return next(new Error('missing request body'));
    }

    const { title, description } = req.body;

    const department: Omit<Department, 'id'> = {
        title,
        slug: slugify(title),
        description,
    };

    const createdDept = await insertDepartment(department);

    if(!createdDept) {
        return next(new Error('unable to create the department'));
    }
    
    return res.status(201).json(createdDept);
}

export async function getDepartment(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;

    const department = await getDepartmentBySlug(slug);

    if(!department) {
        return next();
    }

    return res.json(department);
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;

    const result = await deleteDepartmentBySlug(slug);

    if(result === null) {
        return next();
    }

    if(!result) {
        return next(new Error('failed to delete department'));
    }

    return res.status(204).send();
}
