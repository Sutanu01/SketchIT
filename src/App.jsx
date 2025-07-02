import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Content from "./components/Content";
import Mysketch from "./components/Mysketch";
import Login from "./components/Login";
import Alert from "./components/Alert";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp";
import { useState } from "react";
import { UserProvider } from "./context/UserContext";
import { SketchProvider } from "./context/SketchContext";
function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  };
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.5),rgba(255,255,255,0))]"></div>
      <UserProvider>
        <SketchProvider>
          <Router>
            <Navbar showAlert={showAlert} />
            <Alert alert={alert} />
            <Routes>
              <Route path="/" element={<Content showAlert={showAlert}/>} />
              <Route path="mysketch" element={<Mysketch showAlert={showAlert}/>} />
              <Route path="login" element={<Login showAlert={showAlert} />} />
              <Route path="signup" element={<Signup showAlert={showAlert} />} />
            </Routes>
            <Footer />
          </Router>
        </SketchProvider>
      </UserProvider>
    </>
  );
}

export default App;
