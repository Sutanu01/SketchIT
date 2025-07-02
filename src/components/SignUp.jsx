import React ,{ useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import "./styles/style.css";
import { useUser } from '../context/UserContext';

export default function Signup(props) {
  const [cred, setCred] = useState({
    name: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const { updateUser } = useUser();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cred.name,
        email: cred.email,
        password: cred.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.AuthToken);
      updateUser();
      navigate("/");
      props.showAlert("Successfully created an account", "success");
    } else {
      props.showAlert("Invalid Details try again", "danger");
    }
  };
  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };


  return (
    <div className="wrapper signUp">
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              name="name"
              value={cred.name}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your mail"
              name="email"
              value={cred.email}
              onChange={onChange}
              aria-describedby="emailHelp"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter you password"
              name="password"
              value={cred.password}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <h2 align="center" className="or">
            OR
          </h2>
        </form>
        <p>
          Have an account ? <Link to="/login"> Login </Link>
        </p>
      </div>
    </div>
  );
}
