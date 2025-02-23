// const UserUpdate = () => { 

//     return(
//         <>
//         user update
//         </>
//     )
// }

// export default UserUpdate

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getUserById, updateUser } from "../../AppStore/AuthSlice/userSlice";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById  } from "../../AppStore/AuthSlice/userSlice";


const UserUpdate = ({ id }) => {
//   const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(updateUser({ id, ...formData }));
    // navigate(`/admin-dashboard/user/${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
