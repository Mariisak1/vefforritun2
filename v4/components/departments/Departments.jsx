import { useEffect, useState } from "react";
import { generateApiUrl } from "../../utils/generateApiUrls.js";
import styles from "./Departments.module.css";
import Department from "../department/Department.jsx";
import Link from 'next/link';
import Form from "../form/Form.jsx";
const URL = "http://localhost:4000";

export function Departments({ title }) {
  const [departments, setDepartments] = useState([]);
  const [stateOfFetch, setStateOfFetch] = useState("empty");
  const [selectedDepartment, setSelectedDepartments] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await fetchDepartments();
    }
    fetchData();
  }, []);

  async function fetchDepartments() {
    setStateOfFetch("loading");
    try {
      // await sleep(2)
      const response = await fetch(generateApiUrl("/departments/"));
      if (!response.ok) {
        throw new Error("not ok");
      }
      const json = await response.json();
      setDepartments(json);
      setStateOfFetch("data");
    } catch (e) {
      setStateOfFetch("error");
      console.log(e);
    }
  }

  async function createDepartment(title) {
    try {
      const response = await fetch(generateApiUrl('/departments/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) {
        throw new Error("Náði ekki að búa til deild");
      }
    }
    catch (e) {
      setStateOfFetch("error");
      console.log(e);
    }
  }

  async function handleCreateDepartment(title) {
    try {
      await createDepartment(title);
    }
    catch(e) {
      console.error(e);
    }
  }

  if (stateOfFetch === "error") {
    return <p>Villa við að sækja deild</p>;
  }

  if (stateOfFetch === "loading") {
    return <p>Sæki deild...</p>;
  }

  if (departments.length === 0) {
    return <p>Engar deildir</p>;
  }

  return (
    <div className={styles.departmentsWrapper}>
        <section>
          <h1>Deildir:</h1>
          <ul>
            {departments.map((department) => (
              <li>
                <Link href={`departments/${department.slug}/`}>
                  {department.title}
                </Link>
              </li>
            ))}
          </ul>
          <Form onSubmit={handleCreateDepartment}></Form>
        </section>
    </div>
  );
}

export default Departments;
