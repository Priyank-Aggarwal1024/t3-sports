import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/user/get-users`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to filter users based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Pagination:

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const canGoNext = endIndex < filteredUsers.length;
  const canGoPrev = currentPage > 1;

  return (
    <div className=" px-2 min-h-screen bg-white dark:bg-darkPrimary dark:text-white ">
      <section className="py-1">
        <div className="w-full  mb-12 xl:mb-0 px-4 mx-auto mt-5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                name="search"
                id="search"
                className="border rounded-xl p-2 bg-white  text-black  w-full"
                placeholder="Search by Name, userName, email, or user Role"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            {/* pagination */}
            <div className="m-2 flex justify-end gap-2">
              <button
                onClick={goToPrevPage}
                disabled={!canGoPrev}
                className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-xl ${
                  !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <IoIosArrowBack className="inline-block mr-1" />
                Prev
              </button>
              <button
                onClick={goToNextPage}
                disabled={!canGoNext}
                className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-xl ${
                  !canGoNext ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
                <IoIosArrowForward className="inline-block ml-1" />
              </button>
            </div>
            <div className="block w-full overflow-x-auto">
              {searchText !== "" && filteredUsers.length === 0 ? (
                <p className="text-center">No Users found.</p>
              ) : (
                <table className="items-center bg-transparent w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        No
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Name
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Email
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Mobile
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Username
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .slice(startIndex, endIndex)
                      .map((user, index) => (
                        <tr key={index}>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {startIndex + index + 1}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {user.name}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {user.email}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {user.phoneNo}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {user.username}
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {user.role}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllUsers;
