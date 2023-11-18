import React, { useEffect, useState } from "react";
import Homeheader from "../components/homeHeader";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
const CheckProduct = () => {
  const [suggestedItems, setSuggesteditem] = useState("");
  const [productOnSearch, setProductOnSearch] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:4000/product/search?name=${productOnSearch}`
        );

        if (productResponse.ok) {
          const items = await productResponse.json();
          setSuggesteditem(items.product);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [productOnSearch]);
  const findItems = (e) => {
    setProductOnSearch(e.target.value);
  };
  return (
    <div>
      <Homeheader />
      <div className=" w-full mx-52 mt-20">
        <input
          placeholder="Type Product to Search"
          onChange={findItems}
          className=" w-1/2 border-b-2 border-black outline-none"
        ></input>
      </div>
      <div className="w-full mt-10">
        {suggestedItems.length > 0 && productOnSearch.length > 0 && (
          <div className="flex flex-wrap -mx-4">
            {suggestedItems.map((item, index) => (
              <div
                key={index}
                className={
                  item.quantity <= 0
                    ? ` opacity-40 w-1/4 px-4 my-6 `
                    : `w-1/4 px-4 my-6`
                }
              >
                <Card className=" w-80 transition-transform transform hover:scale-105">
                  <CardHeader
                    color="blue-gray"
                    className="relative h-56 flex items-center justify-center bg-white"
                  >
                    <img src={item.imageUrl} alt={item.productName} />
                  </CardHeader>
                  {item.quantity <= 0 && (
                    <div className=" fixed ml-14 mt-24 text-red-900 font-extrabold text-center text-2xl opacity-100">
                      OUT OF STOCK
                    </div>
                  )}
                  <CardBody>
                    <Typography variant="h3" color="blue-gray" className="mb-2">
                      <span className=" ">{item.productName}</span>
                    </Typography>
                    <Typography>
                      Volume : <span>{item.volume}</span>
                    </Typography>
                    <Typography>
                      Price : <span>{item.price}</span>
                    </Typography>
                    <Typography>
                      Available Quantity : <span>{item.quantity}</span>
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                    <Button>Read More</Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckProduct;
