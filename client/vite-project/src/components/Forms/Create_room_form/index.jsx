import { useState } from "react";
import  { useNavigate } from "react-router-dom"



const CreateRoom = ({uuid, socket, setUser}) => {

  const [roomId,setRoomId] = useState(uuid());
  const [name,setName] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId:uuid(),
      host:true,
      presenter:true,
    }
    setUser(roomData);
    navigate(`/${roomId}`);
    console.log(roomData);
    socket.emit("userJoined", roomData)

  }
   const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      alert("Room ID copied to clipboard!");
    });
  };


    return(
        <form className="form col-md-11 mt-5">


          <div className="form-group">
           <input type="text" className="form-control my-2" placeholder="Enter Your name"
           value={name} onChange={(e) => setName(e.target.value)} />
          </div>
            
            <div className="form-group border">
             <div className="input-group d-flex align-items-center justify-content-center">
           <input type="text" value={roomId} className="form-control my-2 border-0 " disabled placeholder="Generate room code"
           />
           <div className="input-group-append">
         <button className="btn btn-primary btn-sm me-1" type="button"
         onClick={() => setRoomId(uuid())}>
            generate
         </button>
         <button
              className="btn btn-outline-danger btn-sm me-2"
              type="button"
              onClick={handleCopyRoomId}
            >
              copy
            </button>
             </div>
           </div>
           </div>

           
 <button className="mt-4 btn btn-primary btn-block form-control" type="submit" onClick={handleCreateRoom}>
            Generate Room
         </button>
        


        </form>
    )
}

export default CreateRoom;