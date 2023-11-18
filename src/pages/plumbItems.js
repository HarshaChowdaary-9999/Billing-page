import React, { useState, useEffect } from "react";
import HomeHeader from "../components/homeHeader";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";

const PlumbItems = (props) => {
  const { id } = useParams();
  const plumb = id;
  const [itemsInCategory, setItemsInCategory] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:4000/product/${plumb}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setItemsInCategory(data.availableitems.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [plumb]);

  return (
    <div>
      <div>
        <HomeHeader />
      </div>
      <div className="w-full mt-10">
        {itemsInCategory.length > 0 && (
          <div className="flex flex-wrap -mx-4 justify-center">
            {itemsInCategory.map((item, index) => (
              <div
                key={index}
                className={
                  item.quantity <= 0
                    ? ` opacity-40 w-1/4 px-4 my-6 `
                    : `w-1/4 px-4 my-6`
                }
              >
                <Card className="w-80 transition-transform transform hover:scale-105">
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

export default PlumbItems;
