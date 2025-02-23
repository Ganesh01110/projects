import { useState } from "react";

const Sidebar = ({ setSelected }) => {
  return (
    <div className="w-1/3 bg-blue-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="p-2 hover:bg-blue-700 cursor-pointer" onClick={() => setSelected("user")}>
          User
        </li>
        <li className="p-2 hover:bg-blue-700 cursor-pointer" onClick={() => setSelected("billing")}>
          Billing
        </li>
        <li className="p-2 hover:bg-blue-700 cursor-pointer" onClick={() => setSelected("appointment")}>
          Appointment
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;


// export default function Dashboard() {
//   const [selected, setSelected] = useState(null);

//   const renderComponent = () => {
//     switch (selected) {
//       case "user":
//         return <User />;
//       case "billing":
//         return <Billing />;
//       case "appointment":
//         return <Appointment />;
//       default:
//         return <div className="p-4">Welcome! Select an option.</div>;
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar setSelected={setSelected} />
//       <div className="w-4/5 bg-gray-100 h-screen p-4">{renderComponent()}</div>
//     </div>
//   );
// }