// import { Outlet } from "react-router-dom";
// // import LogoutButton from "../../components/LogoutButton";
// import AdminSidebar from "../../components/Sidebar/Sidebar";
// import { useState } from "react";
// import Navbar from "./Navbar";
// import { SubNavbar } from "./SubNavbar";

// const AdminDashboard = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     // setSidebarOpen((prev) => !prev);
//     if (!isSidebarOpen) {
//       setSidebarOpen(true);
//     } else {
//       setSidebarOpen(false);
//     }
//   };

//     return (<> 
//      {/* <AdminSidebar/>
//     <h2>Welcome to the Admin Dashboard</h2> 
//     <LogoutButton/> */}
     
//       {/* navbar */}
//       <Navbar toggleSidebar={toggleSidebar} />

//       <main className="flex items-center w-full">
//         {/* sideabar */}
//         <AdminSidebar
//           isSidebarOpen={isSidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         <div
//           id="dashboard-content"
//           className={`lg:w-[calc(100%-250px)] sm:w-[calc(100%-100px)]  bg-[#f6f9fb] w-full ml-auto ] ${
//             isSidebarOpen ? "" : "content-screen"
//           }`}
//         >
//           <SubNavbar />
//           <Outlet>{children}</Outlet>
//         </div>
//       </main>
  

//     </>
  
//   );
//   };
  
//   export default AdminDashboard;
  

import { useState } from "react";
import Billing from "../../components/billing/Billing";
import Appointment from "../../components/appointment/Appointment";
import Sidebar from "../../components/Sidebar/Sidebar";
import User from "../../components/user/User1";

export default function AdminDashboard() {
  const [selected, setSelected] = useState(null);

  const renderComponent = () => {
    switch (selected) {
      case "user":
        return <User />;
      case "billing":
        return <Billing />;
      case "appointment":
        return <Appointment />;
      default:
        return <div className="p-4">Welcome! Select an option.</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar setSelected={setSelected} />
      <div className="w-4/5 bg-gray-100 h-screen p-4">{renderComponent()}</div>
    </div>
  );
}
