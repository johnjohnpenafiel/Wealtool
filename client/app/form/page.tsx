import React from "react";
import SchoolForm from "./components/SchoolForm";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen py-10">
      <h1 className="w-full text-2xl md:text-4xl font-bold px-10 md:px-24 py-6 dark:text-neutral-200 text-neutral-500">
        Let's search for your school first:
      </h1>
      <SchoolForm />
    </div>
  );
};

export default page;
