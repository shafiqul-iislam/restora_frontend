import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RestaurantListPage from './pages/RestaurantListPage.jsx';
import RestaurantDetailPage from './pages/RestaurantDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/users/Users.jsx';
import UserCreate from './pages/admin/users/UserCreate.jsx';
import UserEdit from './pages/admin/users/UserEdit.jsx';
import UserShow from './pages/admin/users/UserShow.jsx';
import Restaurants from './pages/admin/restaurants/Restaurants.jsx';
import RestaurantCreate from './pages/admin/restaurants/RestaurantCreate.jsx';
import RestaurantEdit from './pages/admin/restaurants/RestaurantEdit.jsx';
import Orders from './pages/admin/orders/Orders.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Owner
import OwnerLayout from './pages/owner/OwnerLayout.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';
import OwnerFoods from './pages/owner/foods/Foods.jsx';
import OwnerOrders from './pages/owner/orders/Orders.jsx';
import OwnerCustomers from './pages/owner/customers/Customers.jsx';
// 404 fallback
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center px-4">
      <div className="text-7xl">🍽️</div>
      <h1 className="text-3xl font-bold text-gray-900">404 — Page Not Found</h1>
      <p className="text-gray-400">Looks like this page was eaten!</p>
      <a href="/" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition mt-2">
        Back to Home
      </a>
    </div>
  );
}

// Pages that use Navbar + Footer layout
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Auth pages — no footer, minimal layout
function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth pages */}
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

            {/* Main app pages */}
            <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
            <Route path="/restaurants" element={<AppLayout><RestaurantListPage /></AppLayout>} />
            <Route path="/restaurants/:id" element={<AppLayout><RestaurantDetailPage /></AppLayout>} />
            <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
            <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />

            {/* Admin pages */}
            {/* <Route path="/admin/dashboard" element={<AdminLayout pageTitle="Dashboard"><Dashboard /></AdminLayout>} /> */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Dashboard"><Dashboard /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Users"><Users /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Create User"><UserCreate /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="User Profile"><UserShow /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Edit User"><UserEdit /></AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/restaurants"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Restaurants"><Restaurants /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Create Restaurant"><RestaurantCreate /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Edit Restaurant"><RestaurantEdit /></AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout pageTitle="Orders"><Orders /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Owner pages */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['restaurant_owner']}>
                  <OwnerLayout pageTitle="Dashboard"><OwnerDashboard /></OwnerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/foods"
              element={
                <ProtectedRoute allowedRoles={['restaurant_owner']}>
                  <OwnerLayout pageTitle="My Foods"><OwnerFoods /></OwnerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/orders"
              element={
                <ProtectedRoute allowedRoles={['restaurant_owner']}>
                  <OwnerLayout pageTitle="Orders"><OwnerOrders /></OwnerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/customers"
              element={
                <ProtectedRoute allowedRoles={['restaurant_owner']}>
                  <OwnerLayout pageTitle="Customers"><OwnerCustomers /></OwnerLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
