import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditEmployee from "./AddEditCompany";
import Modal from "react-modal";
import Navbar from "../../components/navbar/navbar";
import ReactPaginate from "react-paginate";
import axiosInstance from "../../utils/axiosInstance";

interface Company {
  name: string;
  id: string;
  count: string;
  _id: string;
}

interface AddEditModel {
  type: "add" | "edit";
  data: Company | null | undefined | any;
  isShown: any;
}

interface Employee {
  fullName: string;
  email: string;
  password: string;
  company: string;
  role: string;
  _id: string;
}

const Company = () => {
  const [allCompany, setAllCompany] = useState<Company[]>([]);
  const [addEditModel, setAddEditModel] = useState<AddEditModel>({
    type: "add",
    data: null,
    isShown: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [allUsers, setAllUsers] = useState<Employee[]>([]);

  const rowsPerPage: number = 7;
  const offset: number = currentPage * rowsPerPage;
  const currentEmployees: Company[] = allCompany.slice(
    offset,
    offset + rowsPerPage
  );

  //get all company data
  const getData = async () => {
    try {
      const response = await axiosInstance.get("/getCompany");
      console.log(response);
      setAllCompany(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //delete company
  const deleteCompany = async (_id: string) => {
    try {
      const response = await axiosInstance.delete(
        `/deleteCompany/${_id} `
      );

      getData();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle page change
  const handlePageChange = (data: any) => {
    setCurrentPage(data.selected); // `selected` gives the index of the clicked page (0-based)
  };

  const getCompanies = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getUsers");
      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getCompanies();
  }, []);

  return (
    <div>
      <Navbar onSearchEmployee={() => {}} handleClearSearch={() => {}} />

      <div className="relative mt-[100px] ml-[200px] overflow-x-auto shadow-md mr-[200px] sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500 border border-collapse rtl:text-right dark:text-gray-400 border-slate-4s00">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3">
                User Count
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
                    {item.id}
                  </th>
                  <td className="px-6 py-4 ">{item.name}</td>
                  <td className="px-6 py-4">
                    {allUsers
                      .filter((data: any) => data.company === item.name)
                      .length.toString()}
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
                      onClick={() => deleteCompany(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {allCompany.length > rowsPerPage && (
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(allCompany.length / 4)}
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
          data={addEditModel.data}
          onClose={() =>
            setAddEditModel({ isShown: false, data: null, type: "add" })
          }
        />
      </Modal>
    </div>
  );
};

export default Company;
