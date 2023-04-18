import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Department from "../../components/department/Department";
import { generateApiUrl } from "../../utils/generateApiUrls";

export default function DepartmentPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [department, setDepartment] = useState(null);
  const [stateOfFetch, setStateOfFetch] = useState("empty");

  useEffect(() => {
    async function fetchDepartment() {
      if (!slug) return;
      setStateOfFetch("loading");

      try {
        const response = await fetch(generateApiUrl(`/departments/${slug}/`));
        if (!response.ok) {
          throw new Error("Failed to fetch department");
        }
        const data = await response.json();
        setDepartment(data);
        setStateOfFetch("data");
      } catch (e) {
        console.error(e);
      }
    }

    fetchDepartment();
  }, [slug]);

  if (stateOfFetch === "loading") {
    return <p>Sæki deild...</p>;
  }

  return (
    <div>
      <Department department={department} />
      <a href="/departments">Aftur á deildir</a>
    </div>
  );
}
