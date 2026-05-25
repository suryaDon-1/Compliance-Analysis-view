import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PolicyIcon from "@mui/icons-material/Policy";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CategoryIcon from "@mui/icons-material/Category";
export const GetNavigation = (user) => {
 // console.log(user, "user is user");
  return [
    {
      segment: "",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "oraganization",
      title: "Organization",
      icon: <CorporateFareIcon />,
    },
    {
      segment: "products",
      title: "Products",
      icon: <CategoryIcon />,
    },
    {
      segment: "rules",
      title: "Rules and Policy",
      icon: <PolicyIcon />,
    },
    {
      segment: "complince-engine",
      title: "Complince Engine",
      icon: <EngineeringIcon />,
    },
    {
      segment: "reports",
      title: "Reports",
      icon: <AssessmentIcon />,
    },
    {
      kind: "divider", // This adds the divider
    },
    
   !user
  ? {
      segment: "register",
      title: "Register",
      icon: <ExitToAppIcon />,
    }
  : {
      segment: "logout",
      title: "Logout",
      icon: <ExitToAppIcon />,
    },
  ];
};

export default GetNavigation;
