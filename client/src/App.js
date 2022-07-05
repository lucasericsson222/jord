
import React, { useEffect } from "react";
import "./App.css";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import {useState, useRef} from 'react';
const client = new W3CWebSocket('ws://127.0.0.1:3001');

function App() {
  const [command, setCommand] = useState(""); // form data
  const [logData, setLogData] = useState([]); // data array for all messages received from server
  const bottomRef = useRef(null); // reference to the bottom of page for auto scroll feature

  // set up the client connection to the server websocket
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      setLogData(oldLogData => [...oldLogData, message.data]); //add any messages to array of all messages received
    };
  }, []);

  // update the scroll position whenever the array data changes
  useEffect(() => {
    console.log(logData);
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [logData]);

  // create a list of the array data
  const listItems = logData.map((text) => 
    <li>{text}</li>
  );
  
  // handle form submit of message to send to the server
  function sendMessage(event) {
    event.preventDefault();
    client.send(command);
    setCommand("");
  }
  return (
    <div className="App">
      <header className="App-header">
        <ul>{listItems}</ul>
        <div ref={bottomRef}></div>
        <form onSubmit={sendMessage}>
          <input 
            type="text"
            className="commandInput"
            value={command}
            onChange={(e)=> setCommand(e.target.value)} 
          />
        </form>
      </header>
    </div>
  );
}

export default App;
