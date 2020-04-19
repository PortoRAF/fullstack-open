import React from "react";
import Course from "./Course";
import Title from "./Title";

const App = ({ courses }) => {
  const title = "Web development curriculum";

  return (
    <div>
      <Title title={title} />
      {courses.map((course) => (
        <Course course={course} key={course.id} />
      ))}
    </div>
  );
};

export default App;
