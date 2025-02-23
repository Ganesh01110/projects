import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllBills,
    getBillsByPatientId,
    createBill,
    payBill,
} from "../../AppStore/AuthSlice/billingSlice";
import DataTable from "react-data-table-component";

const BillingComponent = () => {
  const dispatch = useDispatch();
  const { bills, patientBills, loading, error } = useSelector(
    (state) => state.bill
  );

  console.log("error:",error);
 
  
  const [patientId, setPatientId] = useState("");
  const [newBill, setNewBill] = useState({ patientId: "", amount: "", description: "" });

  useEffect(() => {
    dispatch(getAllBills());
  }, [dispatch]);

  // const columns1 = [
  //   { name: "ID", selector: (row) => row.id, sortable: true },
  //   { name: "Name", selector: (row) => row.name, sortable: true },
  //   { name: "Email", selector: (row) => row.email },
  // ]
  

  const handlegetBillsByPatientId = () => {
    if (patientId) dispatch(getBillsByPatientId(patientId));
  };

  console.log("bills:",bills);
  console.log("patientBills:",patientBills);

  const handlePayBill = (billId) => {
    dispatch(payBill(billId));
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    const { patientId, amount, description } = newBill;
    if (patientId && amount && description) {
      dispatch(createBill({
        patientId: Number(patientId),
        amount: Number(amount),
        description,
      }));
      setNewBill({ patientId: "", amount: "", description: "" });
    }
  };

  const columns1 = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.patientId, sortable: true },
    { name: "Amount", selector: (row) => row.amount },
       { name: "time", selector: (row) => row.createdAt },
       { name: "description", selector: (row) => row.description },
       {
        name: "Actions",
        cell: (row) => (
          <div className="flex items-center justify-between gap-1">
            <button
                onClick={() => handlePayBill(row.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Pay
              </button>
             </div>
            ),
          },
  ]

  const columns2 = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.patientId, sortable: true },
    { name: "Amount", selector: (row) => row.amount },
       { name: "time", selector: (row) => row.createdAt },
       { name: "description", selector: (row) => row.description },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Fetch all bills */}
      <div>
        <h2 className="text-xl font-bold">All Bills</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {/* <ul>
          {bills.map((bill) => (
            <li key={bill.id} className="border p-2 flex justify-between">
              <span>{bill.description} - ${bill.amount}</span>
              <button
                onClick={() => handlePayBill(bill.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Pay
              </button>
            </li>
          ))}
        </ul> */}
              <DataTable columns={columns1} data={bills} pagination />

      </div>

      {/* Fetch bills by patient ID */}
      <div>
        <h2 className="text-xl font-bold">Fetch Bills by Patient ID</h2>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="border p-2"
        />
        <button onClick={handlegetBillsByPatientId} className="bg-blue-500 text-white px-3 py-1 ml-2">
          Fetch Bills
        </button>
        {/* <ul>
          {patientBills.map((bill) => (
            <li key={bill.id} className="border p-2">
              {bill.description} - ${bill.amount}
            </li>
          ))}
        </ul> */}

{loading && <p>Loading bills by patientid...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <DataTable columns={columns2} data={patientBills} pagination />

      </div>

      {/* Create a bill */}
      <div>
        <h2 className="text-xl font-bold">Create a Bill</h2>
        <form onSubmit={handleCreateBill} className="space-y-2">
          <input
            type="text"
            placeholder="Patient ID"
            value={newBill.patientId}
            onChange={(e) => setNewBill({ ...newBill, patientId: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Amount"
            value={newBill.amount}
            onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={newBill.description}
            onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-purple-500 text-white px-3 py-1 w-full">
            Create Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingComponent;
