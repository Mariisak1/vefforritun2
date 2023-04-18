import Link from "next/link";
import React from "react";
import { generateApiUrl } from "../../utils/generateApiUrls";
import DeleteButton from "../button/DeleteButton";
import { useRouter } from "next/router";

const Department = ({ department }) => {
  const router = useRouter();

  if (!department) {
    return null;
  }

  async function deleteDepartment(slug) {
    try {
      const response = await fetch(generateApiUrl(`/departments/${slug}/`), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Náði ekki að eyða deild");
      }

      router.push("/departments/");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <h2>{department.title}</h2>
      <p>{department.description}</p>
      <Link href={`/departments/${department.slug}/courses/`}>Sjá áfanga</Link>
      <DeleteButton onDelete={deleteDepartment} slug={department.slug} />
    </div>
  );
};

export default Department;
