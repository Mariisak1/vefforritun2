export type Department = {
    id: number;
    title: string;
    slug: string;
    description?: string;
    created?: Date;
    updated?: Date;
}

export type DepartmentImport = {
    title: string;
    slug: string;
    description: string;
    csv: string;
}

export type Course = {
    id: number;
    course_id: string;
    department_id: number;
    title: string;
    classes: number;
    semester: string;
    level?: string;
    url?: string;
    created?: Date;
    updated?: Date;
}

export type CourseImport = {
    id: number;
    course_id: string;
    title: string;
    classes?: number;
    semester: string;
    level?: string;
    url?: string;
}