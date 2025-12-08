import React from 'react';

const MainHeader = ({ header }) => {
  return <h1>{header}</h1>;
};

const Header = ({ course }) => {
  console.log(course.name);
  return <h2>{course.name}</h2>;
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => (
        <p key={part.id}>{part.name} {part.exercises}</p>
      ))}
    </div>
  );
};

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((s, p) => {
    console.log('what is happening', s, p);
    return s + p.exercises;
  }, 0);

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <h3>total of {totalExercises} exercises</h3>
    </div>
  );
};

export { Course, MainHeader };
