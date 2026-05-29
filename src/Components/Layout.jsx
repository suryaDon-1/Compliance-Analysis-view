//import * as React from 'react';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import EngineeringIcon from '@mui/icons-material/Engineering';
// import PolicyIcon from '@mui/icons-material/Policy';
// import CorporateFareIcon from '@mui/icons-material/CorporateFare';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import CategoryIcon from '@mui/icons-material/Category';
import GetNavigation from './GetNavigation.jsx';
import { useAuth } from '../context/context.jsx';
import { useColorScheme } from "@mui/material/styles";
import { useEffect } from 'react';


// const NAVIGATION = [
//   {
//     kind: 'header',
//     title: 'Main items',
//   },
//   {
//     segment: '',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//   },
//    {
//     segment: 'oraganization',
//     title: 'Organization',
//     icon: <CorporateFareIcon />,
//   },
//   {
//     segment: 'products',
//     title: 'Products',
//     icon: <CategoryIcon />,
//   },
//   {
//     segment: 'rules',
//     title: 'Rules and Policy',
//     icon: <PolicyIcon />,
//   },
//   {
//     segment: 'complince-engine',
//     title: 'Complince Engine',
//     icon: <EngineeringIcon />,
//   },
//    {
//     segment: 'reports',
//     title: 'Reports',
//     icon: < AssessmentIcon/>,
//   },
//  {
//     kind: 'divider', // This adds the divider
//   },
//    {
//     segment: 'register',
//     title: 'Register',
//     icon: <ExitToAppIcon />
//   },
  
// ];

function TailwindThemeSync() {
  const { mode } = useColorScheme();

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return null;
}

function Layout() {
  const {user, loading}= useAuth();
  //console.log(user);
const navigationdata = GetNavigation(user);

const loaction = useLocation();
const navigation = useNavigate()
const router = {
    pathname: loaction.pathname,
    navigate: (path) => navigation(path)
}
  return (
      <AppProvider
        navigation={navigationdata}
        router={router}
        branding={{title: "Complince Analysis", logo: <AnalyticsIcon/>}}
      >
        <DashboardLayout>
           <TailwindThemeSync />
            <Outlet/>
        </DashboardLayout>
      </AppProvider>
  );
}



export default Layout;