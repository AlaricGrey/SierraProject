import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Utility function for localStorage operations
const getFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

const ThankYou = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get user info from localStorage - but it should be cleared after submission
    // This is a fallback in case user navigates directly to this page
    const userInfo = getFromLocalStorage("userInfo");
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        setUserName(parsedInfo.fullName.split(" ")[0]); // First name only
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border shadow-glow-strong">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl md:text-4xl font-black font-satoshi gradient-text">
            Submission Received!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-medium">
              {userName && `Thanks ${userName}! `}Your submission is being processed.
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground">
              Close the tab, cross your fingers, and start manifesting for that{" "}
              <span className="gradient-text font-bold">৳5000</span>.
            </p>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Hosted by{" "}
              <span className="font-vt323 text-glow text-foreground text-lg">
                The Sierra Project
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default ThankYou;