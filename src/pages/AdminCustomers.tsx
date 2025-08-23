import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/AdminHeader";
import NavigationTabs from "@/components/NavigationTabs";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";

interface Customer {
  id: string;
  name: string;
  account_number: string;
  ifsc_code: string;
  pan_number: string;
  aadhaar_number: string;
  mobile: string;
  date_registered: string;
  debit_card_number?: string;
  pan_photo_url?: string;
  aadhaar_photo_url?: string;
  debit_card_photo_url?: string;
  created_at: string;
}

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "Customer Deleted",
        description: `${name}'s record has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer record.",
        variant: "destructive"
      });
    }
  };

  const viewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const getDocumentCount = (customer: Customer) => {
    let count = 0;
    if (customer.pan_photo_url) count++;
    if (customer.aadhaar_photo_url) count++;
    if (customer.debit_card_photo_url) count++;
    return count;
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.account_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.pan_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <NavigationTabs />
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-2xl">Customer Management</CardTitle>
                <p className="text-gray-600 mt-1">View and manage all customer records</p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Account Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Loading customers...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-gray-500">No customers found matching your search.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-600">PAN: {customer.pan_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm">{customer.account_number}</p>
                            <p className="text-sm text-gray-600">{customer.ifsc_code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.mobile}</p>
                            <p className="text-sm text-gray-600">Aadhaar: {customer.aadhaar_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDocumentCount(customer) === 3 ? "default" : "secondary"}>
                            {getDocumentCount(customer)}/3 docs
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {new Date(customer.date_registered).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(customer.id, customer.name)}
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

      {/* Customer Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                      <p className="text-gray-900">{selectedCustomer.mobile}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">PAN Number</label>
                      <p className="text-gray-900 font-mono">{selectedCustomer.pan_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Aadhaar Number</label>
                      <p className="text-gray-900 font-mono">{selectedCustomer.aadhaar_number}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Banking Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Number</label>
                      <p className="text-gray-900 font-mono">{selectedCustomer.account_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                      <p className="text-gray-900 font-mono">{selectedCustomer.ifsc_code}</p>
                    </div>
                    {selectedCustomer.debit_card_number && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Debit Card Number</label>
                        <p className="text-gray-900 font-mono">{selectedCustomer.debit_card_number}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Date</label>
                      <p className="text-gray-900">{new Date(selectedCustomer.date_registered).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "PAN Card", url: selectedCustomer.pan_photo_url },
                    { label: "Aadhaar Card", url: selectedCustomer.aadhaar_photo_url },
                    { label: "Debit Card", url: selectedCustomer.debit_card_photo_url },
                  ].map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{doc.label}</span>
                      </div>
                      {doc.url ? (
                        <Badge variant="default" className="text-xs">Uploaded</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Not uploaded</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;