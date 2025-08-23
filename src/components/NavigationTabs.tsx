import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard", active: location.pathname === "/admin/dashboard" },
    { name: "Customers", path: "/admin/customers", active: location.pathname === "/admin/customers" },
    { name: "Staff Management", path: "/admin/staff", active: location.pathname === "/admin/staff" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant="ghost"
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.name}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;