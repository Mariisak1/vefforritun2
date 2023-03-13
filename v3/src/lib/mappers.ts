import { QueryResult } from 'pg';
import { Course, Department } from '../types';

export function valueToSemester(semester: string | undefined): string {
    if(semester === 'Vor' || semester === 'Sumar' || 
    semester == 'Haust' || semester === 'Heilsárs') {
        return semester;
    }
    else return '';
}

export function departmentMapper(input: unknown | null): Department | null {
    const department: Department = {
        id: 0,
        title: '',
        slug: '',
        description: '',
        created: new Date,
        updated: new Date, 
    }

    if(input) {
        const data = input as Department;

        department.id = data.id;
        department.title = data.title;
        department.slug = data.slug;
        department.description = data.description || '';
        department.created = data.created;
        department.updated = data.updated;

        return department;
    }

    return null;
}

  
export function departmentsMapper(input: QueryResult<any> | null): Array<Department> {

    if(!input){
        return [];
    }
    
    const result = input?.rows.map(departmentMapper);

    console.log(result)
    
    return result.filter((i): i is Department => Boolean(i));
}

export function courseMapper(input: unknown | null): Course | null {
    const course: Course = {
        id: 0,
        course_id: '',
        department_id: 0,
        title: '',
        classes: 0,
        semester: '',
        level: '',
        url: '',
        created: new Date,
        updated: new Date, 
    }

    if(input) {
        const data = input as Course;
        
        course.id = data.id;
        course.course_id = data.course_id;
        course.department_id = data.department_id;
        course.title = data.title;
        course.classes = data.classes;
        course.semester = data.semester;
        course.level = data.level;
        course.url = data.url;
        course.created = data.created;
        course.updated = data.updated;

        return course;
    }

    return null;
}

export function coursesMapper(input: QueryResult<any> | null): Array<Course> {

    if(!input){
        return [];
    }
    
    const result = input?.rows.map(courseMapper);

    console.log(result)
    
    return result.filter((i): i is Course => Boolean(i));
}