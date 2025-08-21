import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("role", "staff")
      .single();

    if (data) {
      localStorage.setItem("role", "staff");
      localStorage.setItem("staffId", data.id);
      navigate("/staff/dashboard");
    } else {
      alert("Invalid Staff Login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Staff Login</h2>
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
