import CustomerForm from "@/components/CustomerForm";
import RecordsTable from "@/components/RecordsTable";

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Customers</h1>
        <CustomerForm />
        <RecordsTable staffView={true} />
      </main>
    </div>
  );
};

export default StaffDashboard;
