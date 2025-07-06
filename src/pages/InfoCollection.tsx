import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Utility functions for localStorage operations
const getFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

const setToLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation function (basic)
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
  return phoneRegex.test(phone);
};

const InfoCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhone(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Store user info in localStorage
    setToLocalStorage("userInfo", JSON.stringify(formData));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    navigate("/submission");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-satoshi">
            Let's Get Your Info
          </CardTitle>
          <p className="text-muted-foreground">
            Just the basics so we can reach you when you win.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full font-satoshi"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default InfoCollection;