import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditEmployee from "./AddEditUsers";
import Modal from "react-modal";
import Navbar from "../../components/navbar/navbar";
import ReactPaginate from "react-paginate";
import bcrypt from "bcryptjs";

interface Employee {
  fullName: string;
  email: string;
  password: string;
  company: string;
  role: string;
  _id: string;
}

interface AddEditModel {
  type: "add" | "edit";
  data: Employee | null | undefined | any;
  isShown: any;
}

interface Company {
  name: string;
  id: string;
  count: string;
  _id: string;
}

const Home = () => {
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [addEditModel, setAddEditModel] = useState<AddEditModel>({
    type: "add",
    data: null,
    isShown: false,
  });
  const [allCompany, setAllCompany] = useState<any>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const rowsPerPage: number = 7;
  const offset: number = currentPage * rowsPerPage;
  const currentEmployees: Employee[] = allEmployee.slice(
    offset,
    offset + rowsPerPage
  );

  //get all user data
  const getData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getUsers");
      console.log(response);
      setAllEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //delete user
  const deleteEmployee = async (_id: string) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/deleteEmploy/${_id} `
      );

      getData();
    } catch (error) {
      console.log(error);
    }
  };

  //search user
  const onSearchEmployee = async (query: string) => {
    const response = await axios.get(`http://localhost:5000/search/${query}`);
    setAllEmployee(response.data);
  };

  const handleClearSearch = () => {
    getData();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://127.0.0.1:5000/uploadBulk",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getData();
    }
  };
  // Handle page change
  const handlePageChange = (data: any) => {
    setCurrentPage(data.selected);
  };

  const getCompany = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getCompany");
      setAllCompany(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getCompany();
  }, []);

  return (
    <div>
      <Navbar
        onSearchEmployee={onSearchEmployee}
        handleClearSearch={handleClearSearch}
      />

      <div className="relative mt-[100px] ml-[200px] overflow-x-auto shadow-md mr-[200px] sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500 border border-collapse rtl:text-right dark:text-gray-400 border-slate-4s00">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Password
              </th>
              <th scope="col" className="px-6 py-3">
                Company
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 &&
              currentEmployees.map((item) => (
                <tr className="border-b odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-black whitespace-nowrap "
                  >
                    {item.fullName}
                  </th>
                  <td className="px-6 py-4 ">{item.email}</td>
                  <td className="px-6 py-4">
                    {bcrypt.hashSync(item.password, 10).slice(0, 20)}
                  </td>
                  <td className="px-6 py-4">
                    {allCompany.find((data: any) => data.name === item.company)
                      ?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">{item.role}</td>
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
                      onClick={() => deleteEmployee(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {allEmployee.length > rowsPerPage && (
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(allEmployee.length / 4)}
            onPageChange={handlePageChange}
            containerClassName={"flex space-x-4 items-center"}
            pageClassName={
              "px-4 py-2 cursor-pointer border border-gray-300 rounded"
            }
            activeClassName={"bg-gray-700 text-white"}
            disabledClassName={"text-gray-400 cursor-not-allowed"}
          />
        </div>
      )}

      <div className="relative mt-1  overflow-x-auto  mr-[200px] sm:rounded-lg">
        <button
          className="text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mr-5 float-right"
          onClick={() =>
            setAddEditModel({ type: "add", data: null, isShown: true })
          }
        >
          Add
        </button>
        <div>
          <label
            htmlFor="uploadFile1"
            className="text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mr-5 float-right"
          >
            Upload
            <input
              type="file"
              id="uploadFile1"
              className="hidden"
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
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
          allCompany={allCompany}
          userData={addEditModel.data}
          onClose={() =>
            setAddEditModel({ isShown: false, data: null, type: "add" })
          }
        />
      </Modal>
    </div>
  );
};

export default Home;
