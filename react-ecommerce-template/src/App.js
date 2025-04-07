import Template from "./template/Template";
import ProductDetail from "./products/detail/ProductDetail";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ProductList from "./products/ProductList";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import OrderList from "./pages/OrderList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ViewProduct from "./pages/admin/ViewProduct";

function App() {
  return (
    <Router>
      <Template>
        <Switch>
          <Route path="/products" exact component={ProductList} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <Route path="/orders" component={OrderList} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/add-product" component={AddProduct} />
          <Route path="/admin/edit-product/:id" component={EditProduct} />
          <Route path="/admin/view-product/:id" component={ViewProduct} />
          <Route path="/" exact component={ProductList} />
          <Redirect to="/" />
        </Switch>
      </Template>
    </Router>
  );
}

export default App;
