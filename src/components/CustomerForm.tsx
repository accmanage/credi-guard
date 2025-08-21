import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    debitCardNumber: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [files, setFiles] = useState({
    panPhoto: null as File | null,
    aadhaarPhoto: null as File | null,
    debitCardPhoto: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('customer-documents')
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload files first
      const panPhotoUrl = files.panPhoto ? await handleFileUpload(files.panPhoto, 'pan') : null;
      const aadhaarPhotoUrl = files.aadhaarPhoto ? await handleFileUpload(files.aadhaarPhoto, 'aadhaar') : null;
      const debitCardPhotoUrl = files.debitCardPhoto ? await handleFileUpload(files.debitCardPhoto, 'debit') : null;

      // Save customer data
      const { error } = await supabase
        .from('customers')
        .insert({
          name: formData.name,
          account_number: formData.accountNumber,
          ifsc_code: formData.ifscCode,
          pan_number: formData.panNumber,
          aadhaar_number: formData.aadhaarNumber,
          mobile: formData.mobileNumber,
          debit_card_number: formData.debitCardNumber,
          date_registered: formData.date,
          pan_photo_url: panPhotoUrl,
          aadhaar_photo_url: aadhaarPhotoUrl,
          debit_card_photo_url: debitCardPhotoUrl
        });

      if (error) throw error;

      toast({
        title: "Customer Record Saved",
        description: "The customer record has been added successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: "Failed to save customer record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

            <div className="space-y-2">
              <Label htmlFor="debitCardNumber">Debit Card Number</Label>
              <Input
                id="debitCardNumber"
                value={formData.debitCardNumber}
                onChange={(e) => handleInputChange("debitCardNumber", e.target.value)}
                placeholder="Enter debit card number"
                className="bg-card border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Registration Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                className="bg-card border-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Document Uploads</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "panPhoto", label: "PAN Card" },
                { key: "aadhaarPhoto", label: "Aadhaar Card" },
                { key: "debitCardPhoto", label: "Debit Card" }
              ].map((doc) => (
                <div key={doc.key} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">{doc.label}</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFiles(prev => ({ ...prev, [doc.key]: file }));
                      }
                    }}
                    className="hidden"
                    id={`file-${doc.key}`}
                  />
                  <label 
                    htmlFor={`file-${doc.key}`}
                    className="border-2 border-dashed border-input rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer block"
                  >
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {files[doc.key as keyof typeof files]?.name || `Click to upload ${doc.label}`}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;