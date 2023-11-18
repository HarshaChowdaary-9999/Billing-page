import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBill from "./pages/addBill";
import EditBill from "./pages/editBill";
import DeptList from "./pages/deptList";
import EditProduct from "./pages/editProduct";
import CheckProduct from "./pages/checkProduct";
import HomePage from "./components/homePage";
import PlumbItems from "./pages/plumbItems";
import PaintItems from "./pages/paintsItems";
import ElectricItems from "./pages/electricItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddBill" element={<AddBill />} />
        <Route path="/EditBill" element={<EditBill />} />
        <Route path="/DeptList" element={<DeptList />} />
        <Route path="/EditProduct" element={<EditProduct />} />
        <Route path="/CheckProduct" element={<CheckProduct />} />
        <Route path="/categoryitems/:id" element={<PlumbItems />} />

        <Route path="/CheckProduct" element={<CheckProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
