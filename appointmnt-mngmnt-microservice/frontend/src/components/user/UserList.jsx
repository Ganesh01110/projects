// const UserList = () => {

//     return(
//         <>
//         user list
//         </>
//     )
// }

// export default UserList

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllUsers } from "../redux/userSlice";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../AppStore/AuthSlice/userSlice";
import UserDetails from "./UserDetails";
import UserUpdate from "./UserUpdate";

const UserList = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [id, setId] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-between gap-1">
          <button
            onClick={() => {
              setActiveTab("details");
              setId(row.id);
            }}
            //   onClick={() => navigate(`/admin-dashboard/user/${row.id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            View
          </button>

          <button
            onClick={() => {
              setActiveTab("update");
              setId(row.id);
            }}
            //   onClick={() => navigate(`/admin-dashboard/user/${row.id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
           update
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <DataTable columns={columns} data={users} pagination />

      <div className="h-[70vh] overflow-y-auto border p-4 rounded-lg shadow-lg bg-white">
        {/* {activeTab === "list" && <UserList />} */}
        {activeTab === "details" && <UserDetails id={id} />}
        {activeTab === "update" && <UserUpdate id={id} />}
      </div>
    </div>
  );
};

export default UserList;
