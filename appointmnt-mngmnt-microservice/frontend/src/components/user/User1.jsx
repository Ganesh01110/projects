import React, { useState } from "react";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import UserUpdate from "./UserUpdate";

const User = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <>
      <div className="p-4 h-screen flex flex-col">
        <h2 className="text-xl font-bold mb-2">User Component</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("list")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab("update")}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update User
          </button>
        </div>


        <div className="h-[70vh] overflow-y-auto border p-4 rounded-lg shadow-lg bg-white">
        {activeTab === "list" && <UserList />}
        {activeTab === "details" && <UserDetails />}
        {activeTab === "update" && <UserUpdate />}
      </div>
      </div>

      
    </>
  );
};

export default User;
