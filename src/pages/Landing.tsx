import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGetStarted = () => {
    navigate("/info");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-satoshi leading-tight">
            Rant to Riches
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto">
            Speak out about what no one is saying — and win{" "}
            <span className="gradient-text">৳5000</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            variant="hero"
            size="xl"
            onClick={handleGetStarted}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="font-satoshi text-xl px-16 py-6 relative overflow-hidden"
          >
            <span className="relative z-10">I'm In</span>
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-16">
          <p className="text-sm text-muted-foreground">
            Hosted by{" "}
            <span className="font-vt323 text-glow text-foreground text-lg">
              The Sierra Project
            </span>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Landing;