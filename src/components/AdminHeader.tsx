import { Shield, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  const handleLogout = () => {
    const role = localStorage.getItem("role");

    // clear everything
    localStorage.clear();

    // force redirect to correct login page
    if (role === "admin") {
      window.location.href = "/admin/login";
    } else if (role === "staff") {
      window.location.href = "/staff/login";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className="bg-gradient-primary shadow-medium border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">
              Customer Records
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-primary-foreground/80">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {localStorage.getItem("role") === "staff" ? "Staff Portal" : "Admin Portal"}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
