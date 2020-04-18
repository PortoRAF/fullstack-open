import React, { useState } from "react";
import ReactDOM from "react-dom";

const Display = ({ text }) => <div>{text}</div>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleAnecdoteClick = () => {
    const index = Math.floor(Math.random() * anecdotes.length);
    setSelected(index);
  };

  const handleVoteClick = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const votesText = "has " + votes[selected] + " votes";
  const mostVotedIndex = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Display text={props.anecdotes[selected]} />
      <Display text={votesText} />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleAnecdoteClick} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <Display text={props.anecdotes[mostVotedIndex]} />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
