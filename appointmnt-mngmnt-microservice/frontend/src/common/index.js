// import testSuccess from "../pages/testSuccess";



// const backendDomain = "http://localhost:8081";

// const SummaryApi = {
//     Adminlogin : {
//         url : `${backendDomain}/api/v1/admin/login`,
//         method : "post"
//     },
//     Register : {
//         url : `${backendDomain}/api/v1/admin/register`,
//         method : "post"
//     },  
// }

// export default SummaryApi


const backendDomain = "http://localhost:3000"; // Gateway URL

const SummaryApi = {
    // User Service
    User: {
        base: `${backendDomain}/user`,
        login: { url: `${backendDomain}/user/api/users/login`, method: "post" },
        register: { url: `${backendDomain}/user/api/users/register`, method: "post" },
        getAllUsers: { url: `${backendDomain}/user/api/users/`, method: "get" },
        getUserById: { url: `${backendDomain}/user/api/users/:id`, method: "get" },
    },

    // Billing Service
    Billing: {
        base: `${backendDomain}/billing`,
        createBill: { url: `${backendDomain}/billing/api/billing/bill`, method: "post" },
        payBill: { url: `${backendDomain}/billing/api/billing/bill/:id/pay`, method: "put" },
        getAllBills: { url: `${backendDomain}/billing/api/billing/bills`, method: "get" },
        getBillsByPatientId: { url: `${backendDomain}/billing/api/billing/bills/:patientId`, method: "get" },
    },

    // Appointment Service
    Appointment: {
        base: `${backendDomain}/appointment`,
        schedule: { url: `${backendDomain}/appointment/api/appointment/`, method: "post" },
        complete: { url: `${backendDomain}/appointment/api/appointment/appointment/:id/complete`, method: "put" },
        getAll: { url: `${backendDomain}/appointment/api/appointment/appointments`, method: "get" },
        getByUser: { url: `${backendDomain}/appointment/api/appointment/appointments/:userId`, method: "get" },
    },
};

export default SummaryApi;
