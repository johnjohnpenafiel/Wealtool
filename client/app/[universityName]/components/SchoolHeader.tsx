import React from "react";

interface SchoolHeaderProps {
  name: string;
  city: string;
  state: string;
  url?: string;
}

const SchoolHeader = ({ name, city, state, url }: SchoolHeaderProps) => {
  console.log(name);
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <p className="text-xl text-muted-foreground">
        {city}, {state}
      </p>
      {url && (
        <a
          href={`https://${url}`}
          className="text-blue-500 hover:underline mt-2 block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit School Website
        </a>
      )}
    </div>
  );
};

export default SchoolHeader;
