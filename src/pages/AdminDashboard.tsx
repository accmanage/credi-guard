import { useEffect, useState } from "react";
import { Users, CreditCard, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import NavigationTabs from "@/components/NavigationTabs";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import RecentCustomers from "@/components/RecentCustomers";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    debitCards: 0,
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

      // Count debit cards (customers with debit_card_number)
      const { data: customersWithDebitCards } = await supabase
        .from("customers")
        .select("debit_card_number")
        .not("debit_card_number", "is", null);

      const debitCards = customersWithDebitCards?.length || 0;

      setStats({ 
        totalCustomers: totalCustomers || 0, 
        totalAccounts: totalCustomers || 0, // Same as customers for now
        debitCards 
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <NavigationTabs />
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Customers" 
            value={stats.totalCustomers.toString()} 
            icon={Users}
            trend="Active bank customers"
          />
          <StatsCard 
            title="Total Accounts" 
            value={stats.totalAccounts.toString()} 
            icon={Building2}
            trend="Active bank accounts"
          />
          <StatsCard 
            title="Debit Cards" 
            value={stats.debitCards.toString()} 
            icon={CreditCard}
            trend="Active debit cards"
          />
        </div>

        {/* Recent Customers */}
        <RecentCustomers />
      </main>
    </div>
  );
};

export default AdminDashboard;
