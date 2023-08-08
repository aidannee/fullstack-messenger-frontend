import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [temporaryEditingContent, setTemporaryEditingContent] = useState("");
  const [error, setError] = useState(null);
  const [modePreference, setModePreference] = useState(""); // Add mode preference state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const initialModePreference = mediaQuery.matches ? "dark" : "light";
    setModePreference(initialModePreference);

    const listener = (event) => {
      setModePreference(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getUsernameColor(username, modePreference) {
    const hash = Array.from(username).reduce((acc, char) => {
      return char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc;
    }, 0);

    const hue = ((hash % 360) + 360) % 360; // Ensure the hue is between 0 and 359
    const lightness =
      modePreference === "dark"
        ? "var(--neon-lightness)"
        : "var(--dark-lightness)";
    const saturation =
      modePreference === "dark"
        ? "var(--neon-saturation)"
        : "var(--dark-saturation)";

    const color = `hsl(${hue}, ${saturation}, ${lightness})`;

    return color;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      content: contentInput,
      username: usernameInput,
    };

    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong with creating message request");
        }
        return res.json();
      })
      .then((newDoc) => {
        console.log("newDoc received from server", newDoc);
        setMessages([...messages, newDoc]);
        setContentInput("");
      })
      .catch((error) => setError(error.message));
  };

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
    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: temporaryEditingContent }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong with editing message request");
        }

        return res.json();
      })
      .then((updatedMessageFromBackend) => {
        setMessages(
          messages.map((message) =>
            message.id === editingId ? updatedMessageFromBackend : message
          )
        );
      });
  };

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok && response.status === 204) {
        setMessages(messages.filter((message) => message.id !== id));
      } else {
        setError(
          `Something went wrong with deleting message${response.status} ${response.statusText}`
        );
      }
    });
  };

  return (
    <div className="container mx-auto p-4 mb-5">
      <div className="messages-container">
        {messages
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((message) => {
            const color = getUsernameColor(message.username, modePreference);

            return (
              <div
                className="border flex flex-col md:flex-row md:items-center md:justify-between rounded-md p-2 m-2"
                key={message.id}
                style={{
                  borderColor: color,
                }}
              >
                <div className="flex flex-row items-center mb-2 md:mb-0">
                  <div
                    className="mr-3 rounded-md p-2 m-2"
                    style={{ color: color }}
                  >
                    {message.username}:
                  </div>{" "}
                  {editingId === message.id ? (
                    <input
                      value={temporaryEditingContent}
                      onChange={(e) =>
                        setTemporaryEditingContent(e.target.value)
                      }
                      name="content"
                      type="text"
                    />
                  ) : (
                    <span className="rounded-md p-2 m-2">
                      {message.content}
                    </span>
                  )}
                </div>
                <div className="md:ml-3 flex flex-row border rounded-md border-lime-500 p-2 m-2">
                  <button
                    className="mr-2 text-3xl"
                    onClick={() => handleDelete(message.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="text-3xl"
                    onClick={() => startOrFinishEditing(message.id)}
                  >
                    {editingId === message.id ? "✅" : "🔧"}
                  </button>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-transparent">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:justify-between"
        >
          <input
            className="w-full md:w-1/3 border border-lime-500 rounded-md p-2 m-2"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            name="username"
            type="text"
            placeholder="Username"
          />
          <input
            className="w-full md:w-2/3 border border-lime-500 rounded-md p-2 m-2"
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            name="content"
            type="text"
            placeholder="Your message here"
          />
          <div className="w-full md:w-auto flex md:items-center md:justify-center">
            <button
              className="w-full md:w-auto border border-lime-500 rounded-md p-2 m-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
