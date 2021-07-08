const express = require("express");
const cors = require("cors");
//moment
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
let messages = messagesToTry;
// temp memory 

//no use 
function getNextId() {
  const lastMessageIndex = messages.length - 1;
  if (lastMessageIndex === -1) {
    return 0;
  } else {
    const nextId = lastMessageIndex + 1;
    return nextId;
  }
  // for json object, the id has to be a string: nextId.toString();
}

function validMessage(message) {
  if (message.text && message.from && message !== null) {  // revision de formato de body 
    return true;
  }
  return false;
}

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html"); // que es dirname
});

app.get("/messages", (request, response) => {
  response.status(201).send(messages);
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

app.get("/messages/search/:word", (request, response) => {
  const searchTerm = request.params.word;
  console.log(searchTerm);
  const resultSearch = messages.filter(item => item.text.includes(searchTerm))
  console.log(resultSearch);
  response.status(200).send(resultSearch);
});


// middle ware ? solo cuando quiero sacar el body ? 
// rechazar solicitud formato text 

app.post("/messages", (request, response) => {
  const message = {
    id:  getNextId(),
    from: request.body.from,
    text: request.body.text,
    timeSent: new Date()
  };
  if (!validMessage(message)) {
    response.status(404).send("This message is not complete.");
    return;
  }
  messages.push(message);
  response.status(201).send(message);
});

app.put("/messages/:id", (request, response) => {
  const searchId = parseInt(request.params.id);
  console.log(searchId);
  let newMessage = request.body;
  let message = messagesToTry.find((item) => item.id === searchId);
  console.log(message);
  // let message = messagesToTry.find((item) => item.id === searchId);
  // console.log(message);
  if (!message) {
    response.status(404).send("This message does not exist");
  }
    message.from = newMessage.from;
    message.text = newMessage.text;
    message.timeSent = new Date();
    response.status(201).send(message);
});

app.delete("/messages/:id", (request, response) => {
  const searchId = parseInt(request.params.id);
  console.log(searchId);
  let message = messagesToTry.find((item)=>item.id === searchId)  // findIndex() returns -1 if item is not found, but -1 should not be used as index: negative number is not a valid position
  console.log(message);
  if(message === undefined){
    response.status(404).send(`Does not exist ID register`);
    return;
  }
  let index = messagesToTry.findIndex(item => item.id === searchId);
  if (!message) {
    response.status(404).send();
    return;
  }
  messagesToTry.splice(index, 1);
  response.status(201).send(`${message} was delete`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
