import { useState, useEffect } from "react";
import { Users, FileText, Shield, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";
import RecordsTable from "@/components/RecordsTable";

export default function AdminDashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/admin/login";
    }

    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("staff_data")
        .select("*, users(email, role)");
      if (!error) setRecords(data || []);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Admin Dashboard" />

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={<Users />} title="Total Staff" value={records.length} />
        <StatsCard icon={<FileText />} title="Total Records" value={records.length} />
        <StatsCard icon={<Shield />} title="Admins" value="1" />
        <StatsCard icon={<TrendingUp />} title="Growth" value="+12%" />
      </div>

      <div className="p-6">
        <RecordsTable records={records} loading={loading} />
      </div>
    </div>
  );
}
