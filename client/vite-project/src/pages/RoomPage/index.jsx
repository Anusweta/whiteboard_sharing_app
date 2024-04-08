import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import WhiteBoard from "../../components/Whiteboard";

const RoomPage = ({ user, socket, users}) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openUserTab,setopenUserTab] = useState(false);


    const handleSaveAsPDF = () => {
        const canvas = canvasRef.current;

        // Convert canvas to image using html2canvas
        html2canvas(canvas).then((canvasImage) => {
            const imgData = canvasImage.toDataURL("image/png");

            // Create PDF using jspdf
            const pdf = new jsPDF("p", "mm", [canvas.width, canvas.height]);
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save("whiteboard.pdf");
        });
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white"; // Use fillStyle property to set the color
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Use fillRect to fill the canvas with white color
        setElements([]);
        setHistory([]); // Clear history when clearing the canvas
    };

    const undo = () => {
        if (elements.length > 0) {
            const lastElement = elements[elements.length - 1];
            setHistory((prevHistory) => [...prevHistory, lastElement]);
            setElements((prevElements) => prevElements.slice(0, prevElements.length - 1));
    
            // Clear the canvas
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Redraw all elements except the last one
            elements.slice(0, elements.length - 1).forEach(element => {
                // Draw each element
                // Your drawing logic here
            });
        }
    };

    const redo = () => {
        if (history.length > 0) {
            const lastHistory = history[history.length - 1];
            setElements((prevElements) => [...prevElements, lastHistory]);
            setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
        }
    };

    return (
        <div className="row">
        <button type="button" className="btn btn-dark"
        style={{display:"block", position:"absolute", top:"7%" , left:"3%", height:"50px", width:"100px",}}
        onClick={() =>setopenUserTab(true)}>Users</button>
        {
           openUserTab && (
                <div className="position-fixed top-0 left-0 h-100 text-white bg-dark"
                style={{ width:"250px", left:"0%" }}> 
                 <button type="button" onClick={() =>setopenUserTab(false)} className="btn btn-light btn-block w-100 mt-5" >Close</button>
                 <div className="w-100 mt-5 pt-5">
                 {
                    users.map((usr,index)=> (
                        <p key={index * 999} className="my-2 text-center w-100">
                        {usr.name} {user && user.userId === usr.userId && "(you)" }</p>
                    )) }
                 </div>
                </div>
            )  }
            <h1 className="text-center py-2">
                Whiteboard <span className="text-grey"><h5>[Active Users:{users.length}]</h5></span>
            </h1>  
            {
                user?.presenter && (
                    <div className="col-md-12 gap-5 mt-4 mb-5 d-flex px-5 align-items-center justify-content-between ">
                <div className="d-flex col-md-2  justify-content-between gap-1">
                    <div className="d-flex gap-1 align-items-center ">
                        <label htmlFor="pencil">Pencil</label>
                        <input
                            type="radio"
                            name="tool"
                            id="pencil"
                            value="pencil"
                            checked={tool === "pencil"}
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                        <label htmlFor="line">Line</label>
                        <input
                            type="radio"
                            name="tool"
                            id="line"
                            value="line"
                            checked={tool === "line"}
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                        <label htmlFor="rect">Rectangle</label>
                        <input
                            type="radio"
                            name="tool"
                            id="rect"
                            value="rect"
                            checked={tool === "rect"}
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-2 mx-auto">
                    <div className="d-flex align-items-center">
                        <label htmlFor="color">Select Color:</label>
                        <input
                            type="color"
                            id="color"
                            value={color}
                            className="mt-1 ms-2"
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2 d-flex gap-2">
    <button 
        className={`btn btn-primary ${elements.length === 0 ? 'disabled' : ''}`} 
        onClick={undo}
        disabled={elements.length === 0}
    >
        <FontAwesomeIcon icon={faUndo} />
    </button>
    <button 
        className={`btn btn-primary ${history.length === 0 ? 'disabled' : ''}`} 
        onClick={redo}
        disabled={history.length === 0}
    >
        <FontAwesomeIcon icon={faRedo} />
    </button>
</div>

                <div className="col-md-3 d-flex gap-2">
                    <button className="btn btn-danger px-3" onClick={handleClear}>
                        Clear
                    </button>
                    <button className="btn btn-secondary " onClick={handleSaveAsPDF}>
                        Save as PDF
                    </button>
                </div>
            </div>
           
                ) }
            <div className="col-md-12 mx-auto mt-4 white-box">
                <WhiteBoard 
                canvasRef={canvasRef} 
                ctxRef={ctxRef} 
                elements={elements} 
                setElements={setElements}
                 tool={tool} 
                 color={color}
                 user={user}
                 socket={socket} 
                 />
            </div>
        </div>
    );
};

export default RoomPage;