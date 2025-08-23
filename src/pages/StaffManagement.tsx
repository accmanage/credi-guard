import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/AdminHeader";
import NavigationTabs from "@/components/NavigationTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffUser {
  id: string;
  email: string;
  role: string;
  created_at?: string;
}

interface StaffStats {
  totalStaff: number;
  activeStaff: number;
  staffRecords: number;
}

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [stats, setStats] = useState<StaffStats>({ totalStaff: 0, activeStaff: 0, staffRecords: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: "", password: "", role: "staff" });
  const { toast } = useToast();

  useEffect(() => {
    fetchStaffUsers();
    fetchStats();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      // Type assertion needed until types are regenerated
      const { data, error } = await (supabase as any)
        .from("users")
        .select("*")
        .order("email", { ascending: true });

      if (error) throw error;
      setStaffUsers(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error",
        description: "Failed to load staff users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Type assertion needed until types are regenerated
      const { count: totalStaff } = await (supabase as any)
        .from("users")
        .select("*", { count: "exact", head: true });

      const { count: staffRecords } = await (supabase as any)
        .from("staff_data")
        .select("*", { count: "exact", head: true });

      setStats({
        totalStaff: totalStaff || 0,
        activeStaff: totalStaff || 0, // Assuming all users are active for now
        staffRecords: staffRecords || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Type assertion needed until types are regenerated
      const { error } = await (supabase as any)
        .from("users")
        .insert({
          email: newStaff.email,
          password: newStaff.password,
          role: newStaff.role
        });

      if (error) throw error;

      toast({
        title: "Staff Added",
        description: `${newStaff.email} has been added successfully.`,
      });

      setNewStaff({ email: "", password: "", role: "staff" });
      setIsAddModalOpen(false);
      fetchStaffUsers();
      fetchStats();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: "Failed to add staff member.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStaff = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete staff member "${email}"?`)) return;

    try {
      // Type assertion needed until types are regenerated
      const { error } = await (supabase as any)
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStaffUsers(prev => prev.filter(staff => staff.id !== id));
      toast({
        title: "Staff Deleted",
        description: `${email} has been removed successfully.`,
      });
      fetchStats();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "staff":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredStaff = staffUsers.filter(
    (staff) =>
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <NavigationTabs />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-1">Manage staff accounts and permissions</p>
            </div>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newStaff.role} onValueChange={(value) => setNewStaff(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Staff Member
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
              <p className="text-sm text-blue-600 mt-1">All registered staff members</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeStaff}</p>
              <p className="text-sm text-green-600 mt-1">Currently active users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Staff Records</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.staffRecords}</p>
              <p className="text-sm text-blue-600 mt-1">Total data records</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">Staff Members</CardTitle>
                <p className="text-gray-600 mt-1">Manage staff accounts and roles</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Loading staff...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-gray-500">No staff members found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id} className="hover:bg-gray-50">
                        <TableCell>
                          <p className="font-medium text-gray-900">{staff.email}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(staff.role)}>
                            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteStaff(staff.id, staff.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffManagement;