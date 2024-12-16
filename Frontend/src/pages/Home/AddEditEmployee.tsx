import React, { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";

interface EmployeeData {
  _id:string;
  empNo?: string;
  empName?: string;
  empAddressLine1?: string;
  empAddressLine2?: string;
  empAddressLine3?: string;
  departmentCode?: string;
  dateOfJoin?: string;
  dateOfBirth?: string;
  basicSalary?: string;
  isActive?: boolean;
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
  const [name, setName] = useState<string>(employeeData?.empName || "");
  const [addressLine1, setAddressLine1] = useState<string>(employeeData?.empAddressLine1 || "");
  const [addressLine2, setAddressLine2] = useState<string>(employeeData?.empAddressLine2 || "");
  const [addressLine3, setAddressLine3] = useState<string>(employeeData?.empAddressLine3 || "");
  const [dateJoin, setDateJoin] = useState<string>(employeeData?.dateOfJoin || "");
  const [dateBirth, setDateBirth] = useState<string>(employeeData?.dateOfBirth || "");
  const [department, setDepartment] = useState<string>(employeeData?.departmentCode || "");
  const [salary, setSalary] = useState<string>(employeeData?.basicSalary || "");
  const [employNo, setEmploNo] = useState<string>(employeeData?.empNo || "");
  const [active, setActive] = useState<boolean>(employeeData?.isActive || false);
  const [error, setError] = useState<string | null>(null);

  //Add Employee
  const addEmployee = async () => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/addUser",
            {
              empNo: employNo,
              empName: name,
              empAddressLine1: addressLine1,
              empAddressLine2: addressLine2,
              empAddressLine3: addressLine3,
              departmentCode: department,
              dateOfJoin: dateJoin,
              dateOfBirth: dateBirth,
              basicSalary: salary,
              isActive: active,
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
              empNo: employNo,
              empName: name,
              empAddressLine1: addressLine1,
              empAddressLine2: addressLine2,
              empAddressLine3: addressLine3,
              departmentCode: department,
              dateOfJoin: dateJoin,
              dateOfBirth: dateBirth,
              basicSalary: salary,
              isActive: active,
            });
      
          getData();
          onClose();
        
    } catch (error) {
        console.log(error);
        
    }

  };

  const handleAddEdit = () => {
    if (!employNo) {
      setError("Please Enter the Employ No");
      return;
    }

    if (!name) {
      setError("Please enter the Name");
      return;
    }
    if (!salary) {
      setError("Please Enter the Salary");
      return;
    }
    if (!department) {  
      setError("Please Enter the Department");
      return;
    }

    if (!dateBirth) {
      setError("Please enter the Date of Birth");
      return;
    }
    if (!dateJoin) {
      setError("Please enter the Date of Join");
      return;
    }
    if (!addressLine1) {
      setError("Please enter the Address Line 1");
      return;
    }
    if (!addressLine2) {
      setError("Please enter the Address Line 2");
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

        {type === "add" ? (        <div className="flex flex-col gap-2">
          <label className="flex text-black text-m">Employ No</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={employNo}
            onChange={({ target }) => setEmploNo(target.value)}
          />
        </div>) : (<div></div>)}

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Employ Name</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Addrress Line 1</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={addressLine1}
            onChange={({ target }) => setAddressLine1(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Addrress Line 2</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={addressLine2}
            onChange={({ target }) => setAddressLine2(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Addrress Line 3</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={addressLine3}
            onChange={({ target }) => setAddressLine3(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Salary</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={salary}
            onChange={({ target }) => setSalary(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Date of Birth</label>
          <input
            type="Date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={dateBirth.split("T")[0]}
            onChange={({ target }) => setDateBirth(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Date of Join</label>
          <input
            type="Date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={dateJoin.split("T")[0]}
            onChange={({ target }) => setDateJoin(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Department</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={department}
            onChange={({ target }) => setDepartment(target.value)}
          />
        </div>
        <br />

        <div className="flex items-start mb-5">
          <label className="font-medium text-gray-900 ms-2 text-m dark:text-gray-300">
            Active
          </label>
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={active}
              className="w-4 h-4 mt-1 ml-3 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              onChange={({ target }) => setActive(target.checked)}
            />
          </div>
        </div>
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
