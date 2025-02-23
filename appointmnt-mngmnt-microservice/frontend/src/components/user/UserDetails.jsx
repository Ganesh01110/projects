// const UserDetails = () => { 

//     return(
//         <>
//         user details
//         </>
//     )
// }

// export default UserDetails

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getUserById } from "../redux/userSlice";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../AppStore/AuthSlice/userSlice";

const UserDetails = ({ id }) => {
//   const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [dispatch, id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      {loading && <p>Loading user...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <div className="border p-4 rounded bg-gray-100">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            onClick={() => navigate(`/admin-dashboard/user/update/${id}`)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Update User
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
