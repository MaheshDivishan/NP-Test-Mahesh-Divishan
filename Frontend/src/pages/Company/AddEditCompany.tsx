import React, { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";

interface Company {
    name: string;
    id: string;
    count: string;
    _id:string;
  }
  

interface AddEditCompanyProps {
  data?: Company;
  getData: any;
  type: "add" | "edit";
  onClose: any;
}

const AddEditCompany = ({data,getData,type,onClose}:AddEditCompanyProps) => {

  const [_id, set_Id] = useState<string>(data?._id || "");
  const [name, setName] = useState<string>(data?.name || "");
  const [count, setCount] = useState<string>(data?.name || "0");
  const [id, setId] = useState<string>(data?.id || "");
  const [error, setError] = useState<string | null>(null);

  //Add Company
  const addComapny = async () => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/addCompany",
            {
              id: id,
              name:name,
              count:count
            }
          );
          
        
    } catch (error) {
        console.log(error);
    }
    getData();
    onClose();
    
  };

  
  // Update Company
  const editCompany = async () => {
    try {
        const response = await axios.put(
            "http://127.0.0.1:5000/updateCompany",
            {
              _id:_id,
              name:name,
              id: id,
              count:count
            });
      
          getData();
          onClose();
        
    } catch (error) {
        console.log(error);
        
    }

  };

  const handleAddEdit = () => {
    if (!id) {
      setError("Please Enter the Employ No");
      return;
    }

    if (!name) {
      setError("Please enter the Name");
      return;
    }
    setError("");

    if (type === "edit") {
      editCompany();
    } else {
      addComapny();
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


        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Id</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={id}
            onChange={({ target }) => setId(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex text-black text-m">Name</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={name}
            onChange={({ target }) => setName(target.value)}
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

export default AddEditCompany;
