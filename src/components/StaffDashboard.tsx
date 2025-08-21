import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StaffDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [newData, setNewData] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase.from("entries").select("*").order("created_at", { ascending: false });
    setEntries(data || []);
  };

  const addEntry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("entries").insert([{ user_id: user.id, data: newData }]);
    setNewData("");
    fetchEntries();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Entries</h1>
      <div className="flex space-x-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          placeholder="Enter something..."
        />
        <button onClick={addEntry} className="bg-blue-500 text-white px-4 rounded">Add</button>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="p-2 border rounded">{e.data}</li>
        ))}
      </ul>
    </div>
  );
}
