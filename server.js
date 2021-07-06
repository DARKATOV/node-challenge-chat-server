const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const messagesToTry = [
  { id: 0, from: "Bart", text: "Welcome to CYF chat system!" },
  { id: 1, from: "Anne", text: "Good to see you" },
  { id: 2, from: "Helen", text: "Long time, no see" },
  { id: 3, from: "Anne", text: "let's go for a coffee" },
  { id: 4, from: "Anne", text: "Good to see you 2" },
  { id: 5, from: "Helen", text: "Long time, no see 2" },
  { id: 6, from: "Anne", text: "let's go for a coffee 2" },
  { id: 7, from: "Bart", text: "Welcome to CYF chat system! 2" },
  { id: 8, from: "Anne", text: "Good to see you 3" },
  { id: 9, from: "Helen", text: "Long time, no see 3" },
  { id: 10, from: "Anne", text: "let's go for a coffee 3" },
  { id: 11, from: "Helen", text: "Long time, no see 4" },
  { id: 12, from: "Anne", text: "let's go for a coffee 4" }
];

const alphaMessage = { id: 0, from: "matrix", text: "Welcome to CYF chat system!" }
let messages = [alphaMessage];
// temp memory 

//no use 
// function getNextId() {
//   const lastMessageIndex = messages.length - 1;
//   if (lastMessageIndex === -1) {
//     return 0;
//   } else {
//     const nextId = lastMessageIndex + 1;
//     return nextId;
//   }
//   // for json object, the id has to be a string: nextId.toString();
// }

// function isValidMessage(message) {
//   if (message.text && message.from) {
//     return true;
//   }
//   return false;
// }

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html"); // que es dirname
});

app.get("/messages", (request, response) => {
  response.status(201).send(messages);
});

app.get("/messages/search/:word", (request, response) => {
  const searchTerm = request.params.word;
  console.log(searchTerm);
  const resultSearch = messages.filter(item => item.text.includes(searchTerm))
  console.log(resultSearch);
  response.status(200).send(resultSearch);
});

app.get("/messages/latest", (request, response) => {
  // let resultSearch = messages.slice(-10) // slice con los ultimos diez elementos 
  let resultSearch = messagesToTry.slice(-10) // slice con los ultimos diez elementos 
  console.log(resultSearch);
  response.send(resultSearch);
});

app.get("/messages/:id", (request, response) => {
  const messageId = parseInt(request.params.id);
  const message = messages.find((message) => message.id === messageId);
  if (message) {
    response.status(201).send(message);
  } else {
    response.status(404).send("This message does not exist");
  }
});

app.post("/messages", (request, response) => {
  const message = {
    id:  getNextId(),
    from: request.body.from,
    text: request.body.text,
  };
  // add timestamp to each new message
  message.timeSent = new Date()

  if (!isValidMessage(message)) {
    response.status(404).send("This message is not complete.");
    return;
  }
  messages.push(message);
  response.status(201).send(message);
});

app.put("/messages/:id", (request, response) => {
  const messageId = parseInt(request.params.id);
  let updatedMessage = request.body;

  let message = messages.find((message) => message.id === messageId);
  if (!message) {
    response.status(404).send("This message does not exist");
  }
    message.from = updatedMessage.from;
    message.text = updatedMessage.text;
    timeSent = message.timeSent
    response.status(201).send(updatedMessage);
});

app.delete("/messages/:id", (request, response) => {
  const messageId = request.params.id;

  const index = messages.findIndex((message) => message.id == messageId);
  // findIndex() returns -1 if item is not found, but -1 should not be used as index: negative number is not a valid position
  if (index === -1) {
    res.status(404).send();
    return;
  }
  // remove one item starting from the index that is found
  messages.splice(index, 1);
  res.status(201).send({ success: true });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
