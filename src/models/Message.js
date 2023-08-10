class Message {
  constructor(username, content) {
    if (!this.validate(username, content)) {
      throw new Error("Invalid message");
    }
    this.username = username;
    this.content = content;
  }
  validate(username, content) {
    // these should be strings and not empty
    return (
      typeof username === "string" &&
      username.length > 0 &&
      typeof content === "string" &&
      content.length > 0
    );
  }
}
