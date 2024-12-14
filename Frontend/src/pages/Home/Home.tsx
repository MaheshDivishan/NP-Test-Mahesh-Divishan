import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditEmployee from "./AddEditEmployee";
import Modal from "react-modal";
import Navbar from "../../components/navbar/navbar";



interface Employee {
  empName: string;
  empNo: string;
  empAddressLine1: string;
  empAddressLine2: string;
  empAddressLine3: string;
  departmentCode: string;
  dateOfJoin: string;
  dateOfBirth: string;
  basicSalary: number;
  isActive: boolean;
  id: string;
}


interface AddEditModel {
  type: "add" | "edit";
  data: Employee | null | undefined | any;
  isShown: boolean;
}

const Home = () => {
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [addEditModel, setAddEditModel] = useState<AddEditModel>({
    type: "add",
    data: null,
    isShown: false,
  });
  const [allDepartments, setAllDepartments] = useState<string[]>([]);


  //get all employee data
  const getData = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/v1/getUEmployees");
        console.log(response);
        setAllEmployee(response.data);
        
    } catch (error) {
        console.log(error);
        
    }

    
  };

  //delete employee
  const deleteEmployee = async (empNo:string) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1/deleteEmploy/${empNo} `, {
            headers: {
              accept: "*/*",
              apiToken: "?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf",
            },
          });
      
          // setAllEmployee(response.data);
          getData();
        
    } catch (error) {
        console.log(error);
        
    }

  };

  //search employee
  const onSearchEmployee = (query:string) => {
    query = query.toLowerCase();

    const SearchEmployee = allEmployee.filter((item) =>
      item.empName.toLowerCase().includes(query)
    );
    setAllEmployee(SearchEmployee);
  };

  const handleClearSearch = () => {
    getData();
  };

  // //get all departments
  // const getDepartment = async () => {
  //   try {
  //       const response = await axios.get("api/v1.0/Departments", {
  //           headers: {
  //             accept: "*/*",
  //             apiToken: "?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf",
  //           },
  //         });
      
  //         setAllDepartments(response.data);
        
  //   } catch (error) {
  //       console.log(error);
        
  //   }

  // };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Navbar
        userInfo={null}
        onSearchEmployee={onSearchEmployee}
        handleClearSearch={handleClearSearch}
      />

      <div className="relative mt-10 ml-5 mr-5 overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500 border border-collapse rtl:text-right dark:text-gray-400 border-slate-4s00">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3">
                Employee No
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Join
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Birth
              </th>
              <th scope="col" className="px-6 py-3">
                Salary
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allEmployee.length > 0 &&
              allEmployee.map((item) => (
                <tr className="border-b odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-black whitespace-nowrap "
                  >
                    {item.empName}
                  </th>
                  <td
                    className="px-6 py-4 "
                  >
                    {item.empNo}
                  </td>
                  <td className="px-6 py-4">
                    {item.empAddressLine1 +
                      "," +
                      item.empAddressLine2 +
                      "," +
                      item.empAddressLine3}
                  </td>
                  <td className="px-6 py-4">
                    {
                      item.departmentCode
                    }
                  </td>
                  <td className="px-6 py-4">{item.dateOfJoin.split("T")[0]}</td>
                  <td className="px-6 py-4">
                    {item.dateOfBirth.split("T")[0]}
                  </td>
                  <td className="px-6 py-4">{item.basicSalary}</td>
                  <td className="px-6 py-4">
                    {item.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600 hover:underline"
                      onClick={() =>
                        setAddEditModel({
                          type: "edit",
                          data: item,
                          isShown: true,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="md:sm:font-medium md:sm:text-red-600 md:sm:hover:underline md:ml-4 sm:ml-0 max-sm:text-red-600"
                      onClick={() => deleteEmployee(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          className="text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mr-5 float-right"
          onClick={() =>
            setAddEditModel({ type: "add", data: null, isShown: true })
          }
        >
          Add
        </button>
      </div>
      <Modal
        isOpen={addEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            overflow: "scroll",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white mx-auto mt-2 p-5 "
      >
        <AddEditEmployee
          type={addEditModel.type}
          getData={getData}
          allDepartments={allDepartments}
          employeeData={addEditModel.data}
          onClose={() =>
            setAddEditModel({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>
    </div>
  );
};

export default Home;
