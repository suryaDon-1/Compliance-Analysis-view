import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Organization from "./Pages/Organization.jsx";
import Products from "./Products.jsx";

import Rules from "./Pages/Rules.jsx";
import Reports from "./Reports.jsx";
import ComplinceEng from "./Pages/ComplinceEng.jsx";
import Signup from "./Pages/auth/Signup.jsx";
import Signin from "./Pages/auth/Signin.jsx";
import ProtectedRoute from "./Pages/auth/ProtectedRoute.jsx";
import Logout from "./Pages/auth/Logout.jsx";
import AddProducts from "./Components/AddProducts.jsx";
import AddOrganization from "./Components/AddOrganization.jsx";
function App() {
  const router = createBrowserRouter([
  {
      path: "/",
      element: <Layout />,
      children: [

        // 🔐 ALL PROTECTED ROUTES
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "oraganization",
              element: <Organization />,
            },
            {
              path: "products",
              element: <Products />,
            },
            {
              path: "rules",
              element: <Rules />,
            },
            {
              path: "complince-engine",
              element: <ComplinceEng />,
            },
            {
              path: "reports",
              element: <Reports />,
            },
            {
              path: "addprdoucts",
              element: <AddProducts/>
            },
            {
              path: "addOrganization",
              element: <AddOrganization/>
            }
          ],
        },

        // 🌐 PUBLIC ROUTES
        {
          path: "register",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Signin />,
        },
        {
          path: "logout",
          element: <Logout/>
        }
      ],
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
