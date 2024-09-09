import  { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!values.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!values.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post('http://localhost:3000/auth/adminlogin', values)
        .then((result) => {
          if (result.data.loginStatus) {
            navigate('/dashboard');
          } else {
            setSubmitError(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="flex justify-center items-center  w-2/6 bg-gray-100 loginPage">
      <div className="p-6 rounded-lg w-full border bg-white shadow-md loginForm">
        <div className="text-red-500 mb-4">{submitError && submitError}</div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700 text-[25px]">Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[15px] text-gray-700 font-semibold mb-2">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 h-16 text-[15px] ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[15px] text-gray-700 font-semibold mb-2">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 h-16 text-[15px] ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-[100px] h-16 text-[15px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center"

          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
