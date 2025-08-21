import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminDashboard() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("entries")
      .select("id, data, created_at, user_id, profiles(role)")
      .order("created_at", { ascending: false });
    setEntries(data || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Entries (Admin)</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Data</th>
            <th className="p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="p-2 border">{e.user_id}</td>
              <td className="p-2 border">{e.profiles?.role}</td>
              <td className="p-2 border">{e.data}</td>
              <td className="p-2 border">{new Date(e.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
