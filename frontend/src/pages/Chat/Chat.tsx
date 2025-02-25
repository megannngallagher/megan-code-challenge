import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

export default function Chat({ socket }: { socket: Socket }) {

  const location = useLocation(); 
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [receiverId, setReceiverId] = useState<string>(''); 
  const [ChatPage, setChatPage] = useState<boolean>(false);
  const alreadyJoined = useRef(false);
  const [chatId, setChatId] = useState<string>('');
  const connectionId = location.state.connectionId 
  const users = [];

  const joinChat = (chatId: string, connectionId: string) => {
    console.log("chat id and connection id", chatId,connectionId)
    if (!chatId || !connectionId) {
      console.error('id cannot be empty');
      return;
    }

    if (!alreadyJoined.current){
      setChatId(chatId);
      socket.emit('joinChat', chatId, connectionId);
      alreadyJoined.current = true;
      users.push(connectionId);
      setChatPage(true); 
    }
  };
  
   const sendMessage = () => {
    if (message.trim() && connectionId && receiverId) {
      socket.emit('sendMessageOver', { senderId: connectionId, receiverId, message, chatId });
      setMessage(''); 
    }
  };

  useEffect(() => {
    socket.on('incoming_message', (data: { senderId: string; message: string }) => {
      console.log('Incoming message:', data);
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('incoming_message');
    };
  }, []);

  return (
    <div>
      {!ChatPage ? (
        <div>
          <h1>Go to Chat</h1>
          <input
            type="text"
            placeholder="Enter chat id"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <button onClick={() => joinChat(chatId, connectionId)}>Join</button>
        </div>
      ) : (
        <div>
          <h1>Chat</h1>
          <div>
            <label>Select a receiver:</label>
            <input
              type="text"
              placeholder="Enter receiver's user ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
          </div>
          <div>
            {chatMessages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.senderId}: </strong>{msg.message}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
