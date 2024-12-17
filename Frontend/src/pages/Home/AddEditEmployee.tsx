import React, { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";

interface EmployeeData {
  fullName: string;
  email: string;
  password: string;
  company: string;
  role:string;
  _id:string;
}

interface AddEditEmployeeProps {
  employeeData?: EmployeeData;
  getData: any;
  type: "add" | "edit";
  onClose: any;
  allDepartments: string[];
}

const AddEditEmployee = ({employeeData,getData,type,onClose,allDepartments}:AddEditEmployeeProps) => {

  const [_id, setId] = useState<string>(employeeData?._id || "");
  const [name, setName] = useState<string>(employeeData?.fullName || "");
  const [email, setEmail] = useState<string>(employeeData?.email || "");
  const [company, setCompany] = useState<string>(employeeData?.company || "");
  const [role, setRole] = useState<string>(employeeData?.role || "");
  const [password, setPassword] = useState<string>(employeeData?.password || "");
  const [error, setError] = useState<string | null>(null);

  //Add Employee
  const addEmployee = async () => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/addUser",
            {
              fullName:name,
              email: email,
              password: password,
              company: company,
              role: role,
            }
          );
          
        
    } catch (error) {
        console.log(error);
    }
    getData();
    onClose();
    
  };
  // Update Employee
  const editEmployee = async () => {
    try {
        const response = await axios.put(
            "http://127.0.0.1:5000/updateEmploy",
            {
              _id:_id,
              fullName:name,
              email: email,
              password: password,
              company: company,
              role: role,
            });
      
          getData();
          onClose();
        
    } catch (error) {
        console.log(error);
        
    }

  };

  const handleAddEdit = () => {
    if (!name) {
      setError("Please Enter the Employ No");
      return;
    }

    if (!password) {
      setError("Please enter the Name");
      return;
    }
    if (!email) {
      setError("Please Enter the Salary");
      return;
    }
    if (!company) {  
      setError("Please Enter the Department");
      return;
    }

    if (!role) {
      setError("Please enter the Date of Birth");
      return;
    }

    setError("");

    if (type === "edit") {
      editEmployee();
    } else {
      addEmployee();
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          className="absolute flex items-center justify-center w-10 h-10 rounded-full -top-3 -right-3 hover:bg-slate-50 "
          onClick={onClose}
        >
          <MdClose className="text-xl text-black-500 " />
        </button>

        {/* {type === "add" ? (        <div className="flex flex-col gap-2">
          <label className="flex text-black text-m">Name</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>) : (<div></div>)} */}

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Name</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Email</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Password</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Company</label>
          <select
            value={company}
            onChange={({ target }) => setCompany(target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {type === "add" ? (<option value="">Select Company</option>) : ("")}
            {allDepartments.map((item:any) => (
              <option value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Role</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={role}
            onChange={({ target }) => setRole(target.value)}
          />
        </div>
        <br />
      </div>

      <div>
        {error && (
          <p className="pt-4 text-s ml-[150px] text-red-500 ">{error}</p>
        )}
        <button
          className="text-white ml-[200px] mt-5 bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={handleAddEdit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddEditEmployee;
