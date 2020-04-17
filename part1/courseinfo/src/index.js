import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  const course = "Half Stack application development";
  const content = [
    {
      part: "Fundamentals of React",
      exercises: 10,
    },
    {
      part: "Using props to pass data",
      exercises: 7,
    },
    {
      part: "State of a component",
      exercises: 14,
    },
  ];

  return (
    <div>
      <Header course={course} />
      <Content content={content} />
      <Total content={content} />
    </div>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return props.content.map((object, i) => <Part key={i} content={object} />);
};

const Part = (props) => {
  return (
    <p>
      {props.content.part}: {props.content.exercises}
    </p>
  );
};

const Total = (props) => {
  let total = 0;
  props.content.forEach((object) => (total += object.exercises));
  return <p>Number of exercises: {total}</p>;
};

ReactDOM.render(<App />, document.getElementById("root"));
