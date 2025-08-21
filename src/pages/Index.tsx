import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "staff") {
      navigate("/staff/dashboard");
    } else {
      // Not logged in → send to admin login by default
      navigate("/admin/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-lg font-medium">
      Redirecting...
    </div>
  );
};

export default Index;
