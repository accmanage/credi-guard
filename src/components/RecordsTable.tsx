import { useState } from "react";
import { Search, Edit, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockCustomers = [
  {
    id: 1,
    name: "John Smith",
    accountNumber: "ACC001234567",
    ifscCode: "HDFC0001234",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234-5678-9012",
    mobileNumber: "+91 9876543210",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    accountNumber: "ACC001234568",
    ifscCode: "ICIC0001234",
    panNumber: "FGHIJ5678K",
    aadhaarNumber: "2345-6789-0123",
    mobileNumber: "+91 9876543211",
    date: "2024-01-20",
  },
  {
    id: 3,
    name: "Mike Davis",
    accountNumber: "ACC001234569",
    ifscCode: "SBI0001234",
    panNumber: "KLMNO9012P",
    aadhaarNumber: "3456-7890-1234",
    mobileNumber: "+91 9876543212",
    date: "2024-02-01",
  },
];

const RecordsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.panNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-gradient-card shadow-medium border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <CardTitle className="text-xl text-foreground">Customer Records</CardTitle>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-input w-full sm:w-64"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Account No.</TableHead>
                <TableHead className="text-muted-foreground">IFSC</TableHead>
                <TableHead className="text-muted-foreground">PAN</TableHead>
                <TableHead className="text-muted-foreground">Mobile</TableHead>
                <TableHead className="text-muted-foreground">Date Added</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-border hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-foreground font-mono text-sm">
                    {customer.accountNumber}
                  </TableCell>
                  <TableCell className="text-foreground font-mono text-sm">
                    {customer.ifscCode}
                  </TableCell>
                  <TableCell className="text-foreground font-mono text-sm">
                    {customer.panNumber}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {customer.mobileNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No customers found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordsTable;