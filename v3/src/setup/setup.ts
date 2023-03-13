import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { join } from "path";

import { insertDepartment, insertCourse, query } from "../lib/db.js";
import { DepartmentImport } from "../types.js";
import { parseCsv, parseJson } from "./file.js";

dotenv.config();

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const DATA_DIR = './data';

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

async function setup() {
  const droppedSchema = await dropSchema();

  if (droppedSchema) {
    console.info("schema dropped");
  } else {
    console.info("schema not dropped, exiting");
    process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
  }

  const indexFile = await readFile(join(DATA_DIR, 'index.json'));
  const indexData = parseJson(indexFile.toString('utf-8'));

  for(const item of indexData) {
    const csvFile = await readFile(join(DATA_DIR, item.csv), {encoding: 'latin1'});
    const courses = parseCsv(csvFile);

    const department: Omit<DepartmentImport, 'id'> = {
        title: item.title,
        slug: item.slug,
        description: item.description,
        csv: item.csv,
    };

    const insertedDept = await insertDepartment(department);

    if(!insertedDept) {
        console.error('unable to insert department', item);
        continue;
    }

    console.info('Created department');

    let validInserts = 0;
    let invalidInserts = 0;

    for(const course of courses) {
      const id = await insertCourse(course, insertedDept.id);
      if(id) {
        validInserts++;
      }
      else {
        invalidInserts++;
      }
    }

    console.info(
      `Created department ${item.title} with ${validInserts} courses and ${invalidInserts} invalid courses.`,
    );
  }


}

setup();
