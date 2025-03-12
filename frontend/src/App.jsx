import React, { Suspense, lazy } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { CartProvider } from "./contexts/CartContext";
import UserDashboard from "./pages/UserDashboard";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ProductList = lazy(() => import("./components/ProductList"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const CreateOrderScreen = lazy(() => import("./pages/CreateOrderScreen"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateProduct = lazy(() => import("./pages/CreateProduct"));
const CheckoutScreen = lazy(() => import("./pages/CheckoutScreen"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutFailed = lazy(() => import("./pages/CheckoutFailed"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <ThemeProvider>
          <CartProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                  <AppContent />
              </Suspense>
            </Router>
          </CartProvider>
        </ThemeProvider>
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/products" element={
        <Layout>
           <ProductList showHeader={true} />
        </Layout>
        } />
      <Route path="/product/:id" element={<Product />} />
      
      {/* Protected Routes (Authenticated Users) */}
      <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout">
          <Route index element={<CheckoutScreen />} />
          <Route path="success" element={<CheckoutSuccess />} />
          <Route path="failed" element={<CheckoutFailed />} />
        </Route>
        <Route path="/order/create" element={<CreateOrderScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard">
          <Route index element={<AdminDashboard />} />
          <Route path="products">
            <Route path="create" element={<CreateProduct />} />
          </Route>
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/user/dashboard">
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;