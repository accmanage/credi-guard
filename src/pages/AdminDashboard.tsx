import { useEffect, useState } from "react";
import { Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total customers
      const { count: totalCustomers } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      // Documents count
      const { data: customersWithDocs } = await supabase
        .from("customers")
        .select("pan_photo_url, aadhaar_photo_url, debit_card_photo_url");

      const totalDocuments = customersWithDocs?.reduce((sum, c) => {
        return sum +
          (c.pan_photo_url ? 1 : 0) +
          (c.aadhaar_photo_url ? 1 : 0) +
          (c.debit_card_photo_url ? 1 : 0);
      }, 0) || 0;

      setStats({ totalCustomers, totalDocuments });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />
      <main className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard title="Total Customers" value={stats.totalCustomers.toString()} icon={Users} />
          <StatsCard title="Total Documents" value={stats.totalDocuments.toString()} icon={FileText} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
