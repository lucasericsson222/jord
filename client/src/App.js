
import React, { useEffect } from "react";
import "./App.css";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import {useState, useRef} from 'react';
const client = new W3CWebSocket('ws://127.0.0.1:3001');

function App() {
  const [command, setCommand] = useState("");
  const [logData, setLogData] = useState([]);
  const bottomRef = useRef(null);
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      setLogData(oldLogData => [...oldLogData, message.data]);
    };
  }, []);
  useEffect(() => {
    console.log(logData);
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [logData]);
  const listItems = logData.map((text) => 
    <li>{text}</li>
  );
  
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
