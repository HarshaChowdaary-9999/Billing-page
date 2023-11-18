import React, { useEffect, useState } from "react";
import Homeheader from "./homeHeader";
import { Link } from "react-router-dom";
const HomePage = () => {
  const [deptCollection, setDeptCollection] = useState("");
  const [cnames, setCNames] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptDetails = await fetch(`http://localhost:4000/bill/today`);

        if (deptDetails.ok) {
          const data = await deptDetails.json(); // Added 'await' here
          setDeptCollection(data.users);
        } else {
          console.log("please try again");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the function here
  }, []);
  useEffect(() => {
    const fetchCNames = async () => {
      try {
        const canames = await fetch(
          "http://localhost:4000/product/categorynames"
        );
        if (canames.ok) {
          const data1 = await canames.json();
          setCNames(data1.categories);
        } else {
          console.log("try again");
        }
      } catch (error) {
        console.log("erooorrrr", error);
      }
    };
    fetchCNames();
    console.log("namesss", cnames);
  }, []);
  useEffect(() => {
    console.log(cnames);
  }, [cnames]);

  return (
    <div>
      <div>
        <Homeheader />
      </div>
      <div className=" w-fit flex">
        <div className=" mt-7 ml-7 w-full">
          <div className=" bg-white text-slate-600  p-4 font-extrabold text-4xl">
            <h1>
              Find{" "}
              <span className=" bg-red-500 text-white hover:p-1">Products</span>{" "}
              based on categories
            </h1>
          </div>
          <div className="flex flex-wrap ">
            {cnames.map((items, index) => (
              <Link to={`/categoryitems/${items._id}`} key={index}>
                <div className="box-border h-auto w-fit p-16 ml-10 text-center bg-blue-gray-600 rounded-lg text-black m-2 hover:text-lg">
                  {items.categoryName}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className=" mx-10 w-full mt-7 mr-7 ml-36">
          <div className=" pt-8 text-center text-black font-semibold text-xl">
            Dept collection for today
          </div>
          <div>
            {deptCollection.length > 0 && (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      <th>Name</th>
                      <th>phone Number</th>
                      <th>Billed Date</th>
                      <th> Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptCollection.map((details, index) => (
                      <tr key={index}>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-bold">
                                {details.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{details.phoneNumber}</td>
                        <td>{details.purchasedDate}</td>
                        <th>{details.balanceAmount}</th>
                      </tr>
                    ))}
                  </tbody>
                  {/* foot */}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
