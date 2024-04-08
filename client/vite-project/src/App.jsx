import './App.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client"

import Forms from './components/Forms';
import RoomPage from './pages/RoomPage';
import { useState, useEffect } from 'react';


const server = "http://localhost:5000/"
const connectionOptions = {
  "force new connection" : true,
  reconnectionAttempts: "Infinity",
  timeout:10000,
  transports:["websocket"],
};

const socket = io(server,connectionOptions)

const App = () => {

    const [user,setUser] = useState(null);
    const [users,setUsers] = useState([]);

    useEffect(() => {
      socket.on("userIsJoined", (data) => {
          if (data.success) {
              console.log("userJoined");
              setUsers(data.users);
          } else {
              console.log("user not joined due to error");
          }
      });

      socket.on("allUsers",data =>{
              setUsers(data);
      });

      socket.on("userJoinedMessage", (data) =>{
        toast.info(`${data} joined the room`);
      });
           
      

  }, []);


  const uuid = () => {
    var s4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  return (
    <div className='container'>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users} />} />
      </Routes>
    </div>
  )
}

export default App;