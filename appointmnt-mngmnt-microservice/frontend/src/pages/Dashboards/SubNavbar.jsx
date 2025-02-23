import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import arr_right from '../assets/images/svg/arrow-right.svg';

export function SubNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathNameMap = {
    "/admin": "Home",

    "/admin/medicalDashboard": "Medical Dashboard",
    // for patient
    "/admin/patientDashboard": "Patient Dashboard",
    "/admin/patientRegister": "Register Patient",
    "/admin/opdView": "OPD View",
    "/admin/ipdView": "IPD View",
    "/admin/otView": "OT View",
    "/admin/emergency": "Emergency View",
    "/admin/discharged": "Dischaged View",
    // for doctor
    "/admin/doctorDashboard": "Doctors Dashboard",
    "/admin/doctorRegister": "Register Doctor",
    "/admin/doctorList": "Doctors List",
    "/admin/doctorList/doctorView": "Doctor Profile View",
    "/admin/doctorProfile": "Doctor Profile",
    // foe bed
    "/admin/bedRegister": " Register Bed",
    "/admin/bedList": "  Bed List",
    "/admin/inventoryList": "Inventory List",
    "/admin/inventoryRegister": "Register Inventory ",
    // for lab
    "/admin/labTestList": "Unit Lab Test List",
    "/admin/labPackageList": "Package Lab Test List",
    "/admin/doctorRequest": "Lab Doctor Request",
    "/admin/labPatientList": "Lab Patient List",
    // for pharma
    "/admin/purchaseList": "Purchase Bill List",
    "/admin/purchaseBill": "Add Purchase Bill ",
    "/admin/salesList": " Sales Bill List",
    "/admin/saleBill": "Add Sale Bill ",
    "/admin/stocks": "Medicine Stocks ",
    "/admin/medicineList": "Medicine List ",
    "/admin/pharmaRequest": "Pharma Doctor Request  ",
    // for staff
    "/admin/staffList": "Staff List",
    "/admin/staffRegister": "Register Staff",
    "/admin/departmentList": "Department List",
    "/admin/appointmentList": "Appointment List",
    "/admin/bookAppointment": "Book Appointment",
    // for hrms
    "/admin/hrDashboard": "HR Dashboard",
    "/admin/salaryReports": "Salary Reports ",
    // for ambualance
    "/admin/ambulanceRegister": "Register Ambulance",
    "/admin/ambulanceList": "Ambulance List",
  };

  const loc = location.pathname;
  const activeText = pathNameMap[loc] || "Home";

  return (
    <>
      <div className="p-3 z-50 flex items-center sticky top-[50px] cursor-pointer border-b border-[#dde2ee] bg-white container-shadow">
        <i
          onClick={() => navigate("/admin")}
          className="fa fa-home text-blue-500"
        ></i>
        <i className="fa fa-chevron-right px-3"></i>
        <p className="font-medium">{activeText}</p>
      </div>
    </>
  );
}
