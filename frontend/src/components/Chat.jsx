import React from 'react'
import SingleChat from './SingleChat'
const Chat = ({messages,setMessages,fetchMessages}) => {
  return (
    <div className="w-[65%] h-full bg-white rounded-2xl  shadow-md shadow-blue-300">
      <SingleChat messages={messages} setMessages={setMessages} fetchMessages={fetchMessages} />
    </div>
  );
}

export default Chat