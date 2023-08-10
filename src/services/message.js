import Message from "./models/Message";

// seervice functions related to Messages

// CRUD FETCH function

const createMessage = (e) => {
  // const message = {
  //   content: contentInput,
  //   username: usernameInput,
  // };
  const message = new Message(contentInput, usernameInput);
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
export { createMessage };
