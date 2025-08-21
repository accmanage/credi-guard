import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/AdminHeader";
import RecordsTable from "@/components/RecordsTable";
import CustomerForm from "@/components/CustomerForm";

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Customers</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Documents</h3>
            <p className="text-2xl font-bold">45</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Verified</h3>
            <p className="text-2xl font-bold">90</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">This Month</h3>
            <p className="text-2xl font-bold">30</p>
          </div>
        </div>

        {/* Actions */}
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          Add New Customer
        </Button>

        {showForm && <CustomerForm onClose={() => setShowForm(false)} />}
        <RecordsTable />
      </main>
    </div>
  );
};

export default AdminDashboard;
