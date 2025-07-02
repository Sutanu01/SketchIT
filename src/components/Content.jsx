import React, { useState, useRef, useEffect } from "react";
import "./styles/content.css";
import BrushSvg from "../assets/brush.svg";
import circleSvg from "../assets/circle.svg";
import eraserSvg from "../assets/eraser.svg";
import rectangleSvg from "../assets/rectangle.svg";
import triangleSvg from "../assets/triangle.svg";
import { useSketch } from "../context/SketchContext";
import { useNavigate } from "react-router-dom";


const Content = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [activeTool, setActiveTool] = useState("Brush");
  const [PrevMX, setPrevMX] = useState(0);
  const [PrevMY, setPrevMY] = useState(0);
  const [Snap, setSnap] = useState(null);
  const [FillColor, setFillColor] = useState(false);
  const [Color, setColor] = useState("black");
  const [Details, setDetails] = useState({title: "", description: ""})
  const {addSketch}=useSketch();
  const {showAlert}=props
  const navigate = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signup");  
    } // eslint-disable-next-line
  }, []);



  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const setBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = Color;
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.putImageData(Snap, 0, 0);
    const { x, y } = getCoordinates(e);

    if (activeTool === "Brush") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === "Rectangle") {
      if (!FillColor) ctx.strokeRect(x, y, PrevMX - x, PrevMY - y);
      else ctx.fillRect(x, y, PrevMX - x, PrevMY - y);
    } else if (activeTool === "Circle") {
      ctx.beginPath();
      let r = Math.sqrt(Math.pow(PrevMX - x, 2) + Math.pow(PrevMY - y, 2));
      ctx.arc(PrevMX, PrevMY, r, 0, 2 * Math.PI);
      if (FillColor) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    } else if (activeTool === "Triangle") {
      ctx.beginPath();
      ctx.moveTo(PrevMX, PrevMY);
      ctx.lineTo(x, y);
      ctx.lineTo(PrevMX * 2 - x, y);
      ctx.closePath();
      if (FillColor) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = "white";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    document.body.style.overflow = "hidden";
    const { x, y } = getCoordinates(e);
    setPrevMX(x);
    setPrevMY(y);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = Color;
    ctx.fillStyle = Color;
    setIsDrawing(true);
    setSnap(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  
  const stopDrawing = () => {
    const ctx = canvasRef.current.getContext("2d");
    document.body.style.overflowY = "auto";
    ctx.closePath();
    setIsDrawing(false);
  };
  
  const DownloadImage = () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleToolClick = (id) => {
    setActiveTool(id);
  };

  const handleColorClick = (id) => {
    setColor(id);
  };

  const handleFillColorChange = (e) => {
    setFillColor(e.target.checked);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setLineWidth(val);
  };

  const handleColorChange = (e) => {
    e.target.parentElement.style.background = e.target.value;
    setColor(e.target.value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setBackground();
  }, []);


  const handleSketch=(e)=>{
    e.preventDefault();
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    addSketch(Details.title,Details.description,dataURL)
    setDetails({title: "", description: ""})
    showAlert("Sketch Saved successfully","success")
    setIsModalOpen(false)
  }

  const handleSKetchSave=()=>{
    setIsModalOpen(true)
  }


  const onChange = (e)=>{
    setDetails({...Details, [e.target.name]: e.target.value})
}
  return (
    <>
      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Save this Sketch
                </h3>
                <button
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form className="space-y-4" action="#">
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your title
                    </label>
                    <input onChange={onChange}
                      type="text"
                      name="title"
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required maxLength={10}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your description
                    </label>
                    <textarea onChange={onChange}
                      name="description"
                      id="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleSketch}
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save Sketch
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`all ${isModalOpen ? 'blurred' : ''}`}>
        <div className="cont">
          <section className="tools-board">
            <div className="row">
              <label className="title">Shapes</label>
              <ul className="options">
                <li
                  className={`option tool ${
                    activeTool === "Rectangle" ? "active" : ""
                  }`}
                  id="Rectangle"
                  onClick={() => handleToolClick("Rectangle")}
                >
                  <img src={rectangleSvg} alt="" />
                  <span>Rectangle</span>
                </li>
                <li
                  className={`option tool ${
                    activeTool === "Circle" ? "active" : ""
                  }`}
                  id="Circle"
                  onClick={() => handleToolClick("Circle")}
                >
                  <img src={circleSvg} alt="" />
                  <span>Circle</span>
                </li>
                <li
                  className={`option tool ${
                    activeTool === "Triangle" ? "active" : ""
                  }`}
                  id="Triangle"
                  onClick={() => handleToolClick("Triangle")}
                >
                  <img src={triangleSvg} alt="" />
                  <span>Triangle</span>
                </li>
                <li className="option tool">
                  <input
                    type="checkbox"
                    id="fill-color"
                    checked={FillColor}
                    onChange={handleFillColorChange}
                  />
                  <label htmlFor="fill-color">Fill Color</label>
                </li>
              </ul>
            </div>
            <div className="row">
              <label className="title">Options</label>
              <ul className="options">
                <li
                  className={`option tool ${
                    activeTool === "Brush" ? "active" : ""
                  }`}
                  id="Brush"
                  onClick={() => handleToolClick("Brush")}
                >
                  <img src={BrushSvg} alt="" />
                  <span>Brush</span>
                </li>
                <li
                  className={`option tool ${
                    activeTool === "Eraser" ? "active" : ""
                  }`}
                  id="Eraser"
                  onClick={() => handleToolClick("Eraser")}
                >
                  <img src={eraserSvg} alt="" />
                  <span>Eraser</span>
                </li>
                <li className="option">
                  <input
                    type="range"
                    id="size-slider"
                    min="1"
                    max="20"
                    defaultValue="5"
                    onChange={handleChange}
                  />
                </li>
              </ul>
            </div>
            <div className="row colors">
              <label className="title">Colors</label>
              <ul className="options">
                <li
                  className={`option ${Color === "white" ? "selected" : ""}`}
                  id="White"
                  onClick={() => handleColorClick("white")}
                ></li>
                <li
                  className={`option ${Color === "black" ? "selected" : ""}`}
                  id="Black"
                  onClick={() => handleColorClick("black")}
                ></li>
                <li
                  className={`option ${Color === "#e02020" ? "selected" : ""}`}
                  id="Red"
                  onClick={() => handleColorClick("#e02020")}
                ></li>
                <li
                  className={`option ${Color === "#6dd400" ? "selected" : ""}`}
                  id="Green"
                  onClick={() => handleColorClick("#6dd400")}
                ></li>
                <li className="option">
                  <input
                    type="color"
                    id="color-picker"
                    value="#4A98F7"
                    onChange={handleColorChange}
                  />
                </li>
              </ul>
            </div>
            <div className="row buttons">
              <button
                className="clear-canvas"
                onClick={() => {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  setBackground();
                }}
              >
                Clear All
              </button>
              <button className="download-img" onClick={DownloadImage}>
                Download
              </button>
              <button
                className="save-img"
                onClick={handleSKetchSave}
              >
                Save Image
              </button>
            </div>
          </section>
          <section className="drawing-board">
            <canvas
              ref={canvasRef}
              onTouchStart={startDrawing}
              onTouchMove={drawing}
              onTouchEnd={stopDrawing}
              onMouseMove={drawing}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
            ></canvas>
          </section>
        </div>
      </div>
    </>
  );
};

export default Content;
