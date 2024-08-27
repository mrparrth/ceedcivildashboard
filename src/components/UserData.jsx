// import './style.css';
// const UserData = ({ users }) => {
//   return (
//     <tbody>
//       {users.map((curUser) => {
//         const { id, name, email } = curUser;
//         return (
//           <tr key={id}>
//             <td>{id}</td>
//             <td>{name}</td>
//             <td>{email}</td>
//           </tr>
//         );
//       })}
//     </tbody>
//   );
// };


import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserData = () => {
  const [employee, setEmployee] = useState([]);
//   const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (isMounted) {
          if (result.data.Status) {
            setEmployee(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        }
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(employee.filter(e => e.id !== id));
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>MobileNo</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/${e.image}`}
                    className="employee_image"
                    alt={`${e.name}'s profile`}
                  />
                </td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.number}</td>
                <td>{e.designation}</td>                
                <td>{e.gender}</td>
                <td>{e.course}</td>
                <td>{e.createdate}</td>                
                <td>
                  <Link
                    to={`/dashboard/edit_employee/${e.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// export default ProjectTracker;


export default UserData;
