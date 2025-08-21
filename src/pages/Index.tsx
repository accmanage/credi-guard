import { useState, useEffect } from "react";
import { Users, FileText, Shield, Plus, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";
import CustomerForm from "@/components/CustomerForm";
import RecordsTable from "@/components/RecordsTable";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDocuments: 0,
    verifiedRecords: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Get customers added this month
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const { count: thisMonth } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      // Calculate documents (each customer can have up to 3 docs)
      const { data: customersWithDocs } = await supabase
        .from('customers')
        .select('pan_photo_url, aadhaar_photo_url, debit_card_photo_url');

      const totalDocuments = customersWithDocs?.reduce((count, customer) => {
        return count + 
          (customer.pan_photo_url ? 1 : 0) +
          (customer.aadhaar_photo_url ? 1 : 0) +
          (customer.debit_card_photo_url ? 1 : 0);
      }, 0) || 0;

      setStats({
        totalCustomers: totalCustomers || 0,
        totalDocuments,
        verifiedRecords: totalCustomers || 0, // All records are considered verified
        thisMonth: thisMonth || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="max-w-4xl mx-auto">
            <CustomerForm onClose={() => {
              setShowForm(false);
              fetchStats(); // Refresh stats when form is closed
            }} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Customers"
                value={stats.totalCustomers.toString()}
                icon={Users}
                trend={`+${((stats.thisMonth / Math.max(stats.totalCustomers - stats.thisMonth, 1)) * 100).toFixed(1)}% this month`}
                trendUp={true}
              />
              <StatsCard
                title="Documents"
                value={stats.totalDocuments.toString()}
                icon={FileText}
                trend={`${stats.totalDocuments} files uploaded`}
                trendUp={true}
              />
              <StatsCard
                title="Verified Records"
                value={stats.verifiedRecords.toString()}
                icon={Shield}
                trend="100% verified"
                trendUp={true}
              />
              <StatsCard
                title="This Month"
                value={stats.thisMonth.toString()}
                icon={TrendingUp}
                trend={`${stats.thisMonth} new customers`}
                trendUp={true}
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>
                <p className="text-muted-foreground">Manage customer records and documents</p>
              </div>
              
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </div>

            {/* Records Table */}
            <RecordsTable />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;