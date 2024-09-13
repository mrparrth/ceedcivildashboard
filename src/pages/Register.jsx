// import React from 'react'

import { useState } from "react";


const Register = () => {

    // const [id, idchange] = useState("");
    const [name, namechange] = useState("");
    const [email, emailchange] = useState("");
    const [password, passwordchange] = useState("");
    const [type, typechange] = useState("");
    const [role, rolechange] = useState("");


    const handlesubmit = (e) => {
        e.preventDefault();
        let regobj={name,email,password,type,role};
        console.log(regobj);
        // fetch('http://localhost:3001/register', {
    }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 rounded-lg w-1/4 border bg-white shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <form className="container" onSubmit={handlesubmit}>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                            User Name:
                        </label>
                        <input value={name} onChange={e => namechange(e.target.value)}
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Email:
                        </label>
                        <input value={email} onChange={e => emailchange(e.target.value)}
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                            Password:
                        </label>
                        <input value={password} onChange={e => passwordchange(e.target.value)}
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userType" className="block text-gray-700 font-semibold mb-2">
                            Type:
                        </label>
                        <select
                            value={type}
                            onChange={(e) => typechange(e.target.value)}
                            name="userType"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userrole" className="block text-gray-700 font-semibold mb-2">
                            Role
                        </label>
                        <input value={role} onChange={e => rolechange(e.target.value)}
                            type="text"
                            name="role"
                            // placeholder="Enter Username"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
