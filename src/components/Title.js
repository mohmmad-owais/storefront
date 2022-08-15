import React from "react";

function Title({ name, title }) {
  return (
    <div>
      <div className="text-title">
        <h1 className="text-dark">
          {name} {title}
        </h1>
      </div>
    </div>
  );
}
export default Title;
