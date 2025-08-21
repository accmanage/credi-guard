import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerFormProps {
  onClose: () => void;
}

const CustomerForm = ({ onClose }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
    aadhaarNumber: "",
    mobileNumber: "",
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Customer Record Saved",
      description: "The customer record has been added successfully.",
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gradient-card shadow-large border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-foreground">Add New Customer</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter customer name"
                required
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="Enter account number"
                required
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code *</Label>
              <Input
                id="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                placeholder="Enter IFSC code"
                required
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number *</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                placeholder="Enter PAN number"
                required
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
              <Input
                id="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                placeholder="Enter Aadhaar number"
                required
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                placeholder="Enter mobile number"
                required
                className="bg-card border-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Document Uploads</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["PAN Card", "Aadhaar Card", "Debit Card"].map((docType) => (
                <div key={docType} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">{docType}</Label>
                  <div className="border-2 border-dashed border-input rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload {docType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Customer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;