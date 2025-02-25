import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export default function Home({ socket }: { socket: Socket }) {
  
 const navigate = useNavigate()
 const [connectionId, setConnectionId] = useState<string>('');
 const setConnectionIdForUser = (connectionId: string) => {

    if(connectionId === ''){
      console.error('cannot be null')
      return;
    }
    setConnectionId(connectionId)
    socket.emit('connectUser', connectionId)
    navigate(`/chat/${connectionId}`, {state: {connectionId}}) 
  } 
  
  return (
    <>
    <title>Welcome</title>
    <div>
      <h1>Enter your connection Id to be connected</h1>
      <input
        type="text"
        placeholder="Enter your connection ID"
        value={connectionId}
        onChange={(e) => setConnectionId(e.target.value)}
      />
        <button onClick={() => setConnectionIdForUser(connectionId)}>Join</button>
      </div>
    </>
  )
}
