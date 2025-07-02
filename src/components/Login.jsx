import React ,{ useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import "./styles/style.css";
import { useUser } from '../context/UserContext';

export default function Login(props) {
	const [cred, setCred] = useState({
		email: "",
		password: ""
	  })
	  let navigate = useNavigate();
	  const { updateUser } = useUser();

	  const handleSubmit = async (e) => {
		e.preventDefault()
		const response = await fetch(`http://localhost:5000/api/auth/login`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ email: cred.email, password: cred.password })
		})
		const json = await response.json()
		console.log(json)
		if(json.success){
			localStorage.setItem('token',json.AuthToken)
			updateUser(); 
			navigate('/');
			props.showAlert("Welcome back !","success")
		}
		else{
		  props.showAlert("Invalid Details try again","danger")
		}
	  }


	  const onChange = (e) => {
		setCred({ ...cred, [e.target.name]: e.target.value })
	  }


	return (
		<div className="wrapper signIn">
			<div className="form">
				<div className="heading">LOGIN</div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" placeholder="Enter your Email"  value={cred.email} onChange={onChange} />
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password"  value={cred.password} onChange={onChange} placeholder="Enter you password" />
					</div>
					<button type="submit">
						Submit
					</button>
				</form>
				<p>
					Don't have an account ? <Link to="/signup"> Sign In </Link>
				</p>
			</div>
		</div>
	);
}
