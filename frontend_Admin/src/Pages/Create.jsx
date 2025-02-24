import React, { useState } from "react";
import CollectionForm from "../components/CollectionForm";
import ProductForm from "../components/ProductForm";
import CreateWarehouse from "../components/CreateWarehouse";
import CreateCustomer from "../components/CreateCustomer";

function Create() {
  const [tab, setTab] = useState(2);
  const handleClick = (value) => {
    if (window.innerWidth < 1024 && value == tab) {
      setTab(null);
    } else {
      setTab(value);
    }
  };
  return (
    <>
      <div className="w-full xl:px-16 md:px-8 px-3 md:py-14 py-7 dark:bg-black bg-white">
        <div className="flex justify-center lg:flex-row flex-col lg:gap-9 lg:items-center pb-16">
          <div
            className={`cursor-pointer md:text-2xl text-[17px] lg:p-0 py-4 lg:border-none border-b dark:border-[#7C7C7C] border-black ${
              tab == 1
                ? "dark:text-white text-black  font-medium font-['Inter'] "
                : "dark:text-[#7f7f7f] text-gray-800  font-medium font-['Inter']"
            }`}
          >
            <div
              className="lg:block flex items-center justify-between "
              onClick={() => handleClick(1)}
            >
              <p
                className={`${tab == 1 && "underline underline-offset-[10px]"}`}
              >
                Create Collection
              </p>
              <div className="lg:hidden">
                {tab == 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                  >
                    <path
                      d="M6.98242 0.859497L13.2556 8.09826L0.709235 8.09826L6.98242 0.859497Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                  >
                    <path
                      d="M6.98242 7.83704L0.709234 0.598272L13.2556 0.598271L6.98242 7.83704Z"
                      fill="#808080"
                    />
                  </svg>
                )}
              </div>
            </div>
            {tab == 1 && (
              <div className="lg:hidden py-4 xl:p-16 md:p-8 px-3 sm:p-4 rounded-[10px] my-7 dark:bg-[#121212] bg-[#9b9b9b]">
                <CollectionForm />
              </div>
            )}
          </div>
          <div
            className={`cursor-pointer md:text-2xl text-[17px] lg:p-0 py-4 lg:border-none border-b dark:border-[#7C7C7C] border-black ${
              tab == 2
                ? "dark:text-white text-black  font-medium font-['Inter'] "
                : "dark:text-[#7f7f7f] text-gray-800  font-medium font-['Inter']"
            }`}
          >
            <div
              className="lg:block flex items-center justify-between "
              onClick={() => handleClick(2)}
            >
              <p
                className={`${tab == 2 && "underline underline-offset-[10px]"}`}
              >
                Create Product
              </p>
              <div className="lg:hidden">
                {tab == 2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                  >
                    <path
                      d="M6.98242 0.859497L13.2556 8.09826L0.709235 8.09826L6.98242 0.859497Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                  >
                    <path
                      d="M6.98242 7.83704L0.709234 0.598272L13.2556 0.598271L6.98242 7.83704Z"
                      fill="#808080"
                    />
                  </svg>
                )}
              </div>
            </div>
            {tab == 2 && (
              <div className="lg:hidden py-3 xl:p-16 md:p-8 sm:p-4 px-2 rounded-[10px] my-7 dark:bg-[#121212] bg-[#9b9b9b]">
                <ProductForm />
              </div>
            )}
          </div>
          <div
            className={`cursor-pointer md:text-2xl text-[17px] lg:p-0 py-4 lg:border-none border-b dark:border-[#7C7C7C] border-black ${
              tab == 3
                ? "dark:text-white text-black  font-medium font-['Inter'] "
                : "dark:text-[#7f7f7f] text-gray-800  font-medium font-['Inter']"
            }`}
          >
            <div
              className="lg:block flex items-center justify-between "
              onClick={() => handleClick(3)}
            >
              <p
                className={`${tab == 3 && "underline underline-offset-[10px]"}`}
              >
                Create Warehouse
              </p>
              <div className="lg:hidden">
                {tab == 3 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                  >
                    <path
                      d="M6.98242 0.859497L13.2556 8.09826L0.709235 8.09826L6.98242 0.859497Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                  >
                    <path
                      d="M6.98242 7.83704L0.709234 0.598272L13.2556 0.598271L6.98242 7.83704Z"
                      fill="#808080"
                    />
                  </svg>
                )}
              </div>
            </div>
            {tab == 3 && (
              <div className="lg:hidden py-3 px-2 xl:p-16 md:p-6 rounded-[10px] my-7 dark:bg-[#121212] bg-[#9b9b9b]">
                <CreateWarehouse />
              </div>
            )}
          </div>
          <div
            className={`cursor-pointer md:text-2xl text-[17px] lg:p-0 py-4 lg:border-none border-b dark:border-[#7C7C7C] border-black ${
              tab == 4
                ? "dark:text-white text-black  font-medium font-['Inter'] "
                : "dark:text-[#7f7f7f] text-gray-800  font-medium font-['Inter']"
            }`}
          >
            <div
              className="lg:block flex items-center justify-between "
              onClick={() => handleClick(4)}
            >
              <p
                className={`${tab == 4 && "underline underline-offset-[10px]"}`}
              >
                Create Customer
              </p>
              <div className="lg:hidden">
                {tab == 4 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                  >
                    <path
                      d="M6.98242 0.859497L13.2556 8.09826L0.709235 8.09826L6.98242 0.859497Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                  >
                    <path
                      d="M6.98242 7.83704L0.709234 0.598272L13.2556 0.598271L6.98242 7.83704Z"
                      fill="#808080"
                    />
                  </svg>
                )}
              </div>
            </div>
            {tab == 4 && (
              <div className="lg:hidden py-3 px-2 xl:p-16 md:p-6 rounded-[10px] my-7 dark:bg-[#121212] bg-[#9b9b9b]">
                <CreateCustomer />
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:block hidden rounded-[20px] xl:p-16 md:p-8 px-6 py-5 dark:bg-[#121212] bg-[#9b9b9b]">
          {tab == 1 && <CollectionForm />}
          {tab == 2 && <ProductForm />}
          {tab == 3 && <CreateWarehouse />}
          {tab == 4 && <CreateCustomer />}
        </div>
      </div>
    </>
  );
}

export default Create;
