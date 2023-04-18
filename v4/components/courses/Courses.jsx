import { useEffect, useState } from "react";
import { generateApiUrl } from "../../utils/generateApiUrls.js";
import NewCourseForm from "../newCourseForm/NewCourseForm.jsx";
const URL = "http://localhost:4000";

export function Courses({ slug }) {
  const [courses, setCourses] = useState([]);
  const [stateOfFetch, setStateOfFetch] = useState("empty");

  useEffect(() => {
    async function fetchData() {
      await fetchCourses();
    }
    fetchData();
  }, []);

  async function fetchCourses() {
    setStateOfFetch("loading");
    try {
      // await sleep(2)
      const response = await fetch(
        generateApiUrl(`/departments/${slug}/courses/`)
      );
      if (!response.ok) {
        throw new Error("Náði ekki að ná í áfanga");
      }
      const json = await response.json();
      setCourses(json);
      setStateOfFetch("data");
    } catch (e) {
      setStateOfFetch("error");
      console.log(e);
    }
  }

  async function createCourse(slug, courseData) {

    try {
      const response = await fetch(generateApiUrl(`/departments/${slug}/courses/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...courseData }),
      });

      console.log('createCourse BODYHAHAHA', JSON.stringify(courseData));
      
      if (!response.ok) {
        throw new Error("Náði ekki að búa til áfanga");
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  async function handleCreateCourse(courseData) {
    try {
        await createCourse(slug, courseData);
        await fetchCourses();
    }
    catch(e) {
        console.log(e);
    }
  }

  if (stateOfFetch === "error") {
    return <p>Villa við að sækja áfanga</p>;
  }

  if (stateOfFetch === "loading") {
    return <p>Sæki áfanga...</p>;
  }

  if (courses.length === 0) {
    return (
        <div>
            <p>Engir áfangar</p>
            <NewCourseForm onSubmit={handleCreateCourse} />
        </div>
    );
  }

  return (
    <div>
      <section>
        <h1>Áfangar:</h1>
        <table>
          <tr>
            <th>Námskeið</th>
            <th>Nafn</th>
            <th>Einingar</th>
            <th>Kennslumisseri</th>
            <th>Námsstig</th>
            <th>Slóð á kennsluskrá</th>
          </tr>
          {courses.map((course) => (
            <tr>
              <td>{course.course_id}</td>
              <td>{course.title}</td>
              <td>{course.units}</td>
              <td>{course.semester}</td>
              <td>{course.level}</td>
              <td><a href={course.url}>Slóð</a></td>
            </tr>
          ))}
        </table>
      </section>
      <NewCourseForm onSubmit={handleCreateCourse} />
    </div>
  );
}


export default Courses;
