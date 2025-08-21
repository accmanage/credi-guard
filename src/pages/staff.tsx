import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";
import RecordsTable from "@/components/RecordsTable";
import CustomerForm from "@/components/CustomerForm";

const StaffDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <p className="mb-4 text-muted-foreground">
        Welcome, you can manage only your assigned customers.
      </p>
      
      <CustomerForm staffId={user.id} />
      <RecordsTable staffId={user.id} />
    </div>
  );
};

export default StaffDashboard;
