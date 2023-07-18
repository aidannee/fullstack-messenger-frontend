import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1122/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <>
      {messages
        .sort((a, b) => a.created - b.created)
        .map((message) => {
          return (
            <div key={message.id}>
              {message.text} --- {message.username}{" "}
            </div>
          );
        })}
    </>
  );
}

export default App;
