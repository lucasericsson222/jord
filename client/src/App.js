
import React, { useEffect } from "react";
import "./App.css";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import {useState, useRef} from 'react';
const client = new W3CWebSocket('ws://127.0.0.1:3001');

const colorCodes = {
  "@R":"Red",
  "@B":"Blue",
  "@G":"Green",
  "@W":"White",
  "@Y":"Yellow",
  "@P":"Purple"
}

function App() {
  const [command, setCommand] = useState(""); // form data
  const [logData, setLogData] = useState([]); // data array for all messages received from server
  const bottomRef = useRef(null); // reference to the bottom of page for auto scroll feature
  const inputRef = useRef(null);
  // set up the client connection to the server websocket
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      setLogData(oldLogData => [...oldLogData, message.data]); //add any messages to array of all messages received
    };
    inputRef.current?.focus();
  }, []);

  // update the scroll position whenever the array data changes
  useEffect(() => {
    console.log(logData);
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [logData]);

  function colorParseString(text) {
    for(let property in colorCodes) {
      text = text.replaceAll(property, "<span style=\"color:"+colorCodes[property]+"\">");
    }
    text = text.replaceAll("\n", "<br>");
    return text;
  }
  function escapeHTML(text) {
    var replacements= {"<": "&lt;", ">": "&gt;","&": "&amp;", "\"": "&quot;"};                      
    return text.replace(/[<>&"]/g, function(character) {  
        return replacements[character];  
    }); 
  }
  // create a list of the array data
  const listItems = logData.map((text) => 
    <p dangerouslySetInnerHTML={{__html:colorParseString(escapeHTML(text))}}></p>
  );
  
  // handle form submit of message to send to the server
  function sendMessage(event) {
    event.preventDefault();
    client.send(command);
    setCommand("");
  }
  function handleBlur(event){
    inputRef.current?.focus();
  }
  return (
    <div className="App">
      <header className="App-header">
        {listItems}
        <form onSubmit={sendMessage}>
          <p className="cursor">{">"}&nbsp;</p>
          <input 
            onBlur={handleBlur}
            ref={inputRef}
            type="text"
            className="commandInput"
            value={command}
            onChange={(e)=> setCommand(e.target.value)} 
          />
          <div ref={bottomRef}></div>
        </form>
      </header>
    </div>
  );
}

export default App;
