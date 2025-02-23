import { Socket } from 'socket.io-client';
import { useState } from 'react';
import {Modal, Input} from 'antd';

export default function Chat({ socket }: { socket: Socket }) {
  console.log(socket)
  const [username, SetUsername] = useState<string>('');
  
  const usernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetUsername(e.target.value);
  };
  
  return (
    <>
    <title>Welcome</title>
    <Modal
    title="Enter a username to chat"
    visible={true}
    onCancel={() => {}}
    onOk={() => {}}>
    
    <Input placeholder="enter username" value={username} onChange={usernameInput}/>
    </Modal>
    </>
  )
}
