import SchoolForm from "./components/SchoolForm";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen py-10">
      <h1 className="w-full text-2xl md:text-4xl font-bold px-10 md:px-24 pt-10 pb-3 dark:text-neutral-200 text-neutral-800">
        Let's begin by finding your school
      </h1>
      <SchoolForm />
    </div>
  );
};

export default page;
