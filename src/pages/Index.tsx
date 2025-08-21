import { useState } from "react";
import { Users, FileText, Shield, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";
import CustomerForm from "@/components/CustomerForm";
import RecordsTable from "@/components/RecordsTable";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="max-w-4xl mx-auto">
            <CustomerForm onClose={() => setShowForm(false)} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Customers"
                value="1,247"
                icon={Users}
                trend="+12.5% this month"
                trendUp={true}
              />
              <StatsCard
                title="Documents"
                value="3,741"
                icon={FileText}
                trend="+8.2% this month"
                trendUp={true}
              />
              <StatsCard
                title="Verified Records"
                value="1,089"
                icon={Shield}
                trend="98.7% verified"
                trendUp={true}
              />
              <StatsCard
                title="This Month"
                value="156"
                icon={TrendingUp}
                trend="+24.1% vs last month"
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