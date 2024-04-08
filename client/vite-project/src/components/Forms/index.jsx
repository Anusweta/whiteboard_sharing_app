import CreateRoom from "./Create_room_form";
import JoinRoom from "./Join_room_form";
import "./index.css";





const Forms = ({uuid, socket, setUser}) => {
    return(
        <div className="row h-100 pt-5">
             <div className="col-md-4 form-box  p-5 mx-auto mt-5 border border-2 border-primary rounded-2 d-flex flex-column align-items-center">
                      <h1 className="text-primary fw-bold">Create Room</h1>
                      <CreateRoom  uuid={uuid} socket={socket} setUser={setUser} />
             </div>
             <div className="col-md-4 mx-auto mt-5 form-box  p-5 border border-2 border-primary rounded-2 d-flex flex-column align-items-center ">
                      <h1 className="text-primary fw-bold">Join Room</h1>
                      <JoinRoom uuid={uuid} socket={socket} setUser={setUser} />
             </div>

        </div>
    )
};
export default Forms;