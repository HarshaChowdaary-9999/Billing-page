import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  
} from "@material-tailwind/react";

const  HomeHeader=()=> {
  const [openNav, setOpenNav] = useState(false);
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='/AddBill'>
        Add Bill</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='/EditBill'>Edit Bill</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='DeptList'>Dept List</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='/EditProduct'>Edit product</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='/CheckProduct'>Check product</Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1  font-semibold hover:bg-black hover:text-white rounded-md"
      >
        <Link to='/EditProduct'>User Bills</Link>
      </Typography>
    </ul>
  );
  return (
    <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900  ">
      <Link to='/' >
        <Typography
          
          className="mr-4 cursor-pointer py-1.5 font-medium  hover:bg-black hover:text-white rounded-md px-2"
        >
          
          Home
          
        </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <span>Shop Name</span>
        
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          <Button variant="gradient" size="sm" fullWidth className="mb-2">
            <span>Shop Name</span>
          </Button>
        </div>
      </MobileNav>
    </Navbar>
  );
}

export default HomeHeader;
