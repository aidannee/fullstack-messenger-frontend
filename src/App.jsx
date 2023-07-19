import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [temporaryEditingContent, setTemporaryEditingContent] = useState(""); // TEMPORARY STATE FOR EDITING

  // WHEN THE APP LOADS, GET ALL MESSAGES
  useEffect(() => {
    // GET REQUEST (POLLING EVERY 1 SECOND)
    setInterval(() => {
      fetch("http://localhost:1122/messages", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }, 1000);
  }, []);

  // useEffect(() => {
  //   // console.log(messages);
  // }, [messages]);

  // CREATE MESSAGE
  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      content: contentInput,
      username: usernameInput,
    };

    fetch("http://localhost:1122/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((newDoc) => {
        console.log("newDoc received from server", newDoc);
        setMessages([...messages, newDoc]);
      });
  };

  // PUT MESSAGE

  // PUT MESSAGE
  const startOrFinishEditing = (id) => {
    if (editingId === id) {
      finishEditingAndSaveChangesInServer();
    } else {
      startEditing(id);
    }
  };

  const startEditing = (id) => {
    setEditingId((previous) => (previous === id ? null : id));
    setTemporaryEditingContent(
      messages.find((message) => message.id === id).content
    );
  };

  const finishEditingAndSaveChangesInServer = () => {
    setEditingId(null);
    fetch(`http://localhost:1122/messages/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: temporaryEditingContent }),
    })
      .then((res) => res.json())
      .then((updatedMessageFromBackend) => {
        setMessages(
          messages.map((message) =>
            message.id === editingId ? updatedMessageFromBackend : message
          )
        );
      });
  };

  // DELETE MESSAGE
  const handleDelete = (id) => {
    fetch(`http://localhost:1122/messages/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok && response.status === 204) {
        setMessages(messages.filter((message) => message.id !== id));
      }
    });
  };

  return (
    <>
      <h1>editingId: {editingId ? editingId : "null"}</h1>
      {messages
        .sort((a, b) => a.created_at - b.created_at)
        .map((message) => {
          return (
            <div key={message.id}>
              {message.username}:{" "}
              {editingId === message.id ? (
                <input
                  value={temporaryEditingContent}
                  onChange={(e) => setTemporaryEditingContent(e.target.value)}
                  name="content"
                  type="text"
                />
              ) : (
                <div>{message.content}</div>
              )}
              <button onClick={() => handleDelete(message.id)}>🚮</button>
              <button onClick={() => startOrFinishEditing(message.id)}>
                🔧
              </button>
            </div>
          );
        })}

      <form onSubmit={handleSubmit}>
        <input
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          name="username"
          type="text"
        />
        <input
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          name="content"
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
