import React, { createContext, useState, useContext } from 'react';
const SketchContext = createContext();

export const useSketch = () => {
    return useContext(SketchContext);
  };

export const SketchProvider = (props) => {
  
  const host = "http://localhost:5000"
  const [Sketchs, setSketchs] = useState([])

const getSketchs = async () => {
    const response = await fetch(`${host}/api/sketch/getsketchs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "AuthToken": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    setSketchs(json)
  }
  const addSketch = async (title, description, img) => {
    const response = await fetch(`${host}/api/sketch/addsketch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "AuthToken": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, img })
    })
    const Sketch=await response.json()
    setSketchs(Sketchs.concat(Sketch))
  }

  const deleteSketch = async (id) => {
    const response = await fetch(`${host}/api/sketch/deletesketch/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "AuthToken": localStorage.getItem('token')
      },
    })
    const json = await response.json()
    const newSketchs = Sketchs.filter((Sketch) => { return Sketch._id !== id })
    setSketchs(newSketchs)
  }

  return (
    <SketchContext.Provider value={{ Sketchs, addSketch, deleteSketch, getSketchs,setSketchs }}>
      {props.children}
    </SketchContext.Provider>
  )
}