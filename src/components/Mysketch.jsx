import React, { useContext, useEffect, useState } from "react";
import Sketch from "./Sketch";
import { useSketch } from "../context/SketchContext";
import { Link, useNavigate } from "react-router-dom";
const Mysketch = (props) => {
  const { showAlert } = props;
  const { Sketchs, getSketchs,setSketchs } = useSketch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getSketchs();
    } else {
      navigate("/signup");
      setSketchs([]);
    } // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={`flex h-auto flex-wrap w-screen ${Sketchs.length === 0 ?"justify-center":""}`}>
        <div className="flex flex-wrap text-center justify-center text-3xl font-extrabold">
          {Sketchs.length === 0 ? (
            <>
              <div>You have not drawn anything yet !</div>
              <Link to="/" className="bg-emerald-100 text-teal-800">
                Start drawing Now
              </Link>{" "}
            </>
          ) : (
            ""
          )}
        </div>
        {Sketchs.map((sketch) => {
          return (
            <Sketch key={sketch._id} showAlert={showAlert} Sketch={sketch} />
          );
        })}
      </div>
    </>
  );
};

export default Mysketch;
