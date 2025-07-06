import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-black font-satoshi gradient-text">
          404
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Oops! This page doesn't exist
        </p>
        <Button
          variant="cta"
          size="lg"
          onClick={() => window.location.href = "/"}
          className="font-satoshi"
        >
          Back to Home
        </Button>
      </div>
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default NotFound;
