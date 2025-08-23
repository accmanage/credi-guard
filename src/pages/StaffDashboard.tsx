import { useState, useEffect } from "react";
import { FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";
import RecordsTable from "@/components/RecordsTable";

export default function StaffDashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const staffId = localStorage.getItem("staffId");
    if (role !== "staff") {
      window.location.href = "/staff/login";
    }

    const fetchRecords = async () => {
      // Type assertion needed until types are regenerated
      const { data, error } = await (supabase as any)
        .from("staff_data")
        .select("*")
        .eq("staff_id", staffId);
      if (!error) setRecords(data || []);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard icon={FileText} title="My Records" value={records.length.toString()} />
        <StatsCard icon={TrendingUp} title="Performance" value="+5%" />
      </div>

      <div className="p-6">
        <RecordsTable />
      </div>
    </div>
  );
}
