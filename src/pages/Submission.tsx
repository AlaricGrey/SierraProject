import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

const Submission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState({
    entry1: "",
    entry2: "",
    entry3: "",
    entry4: "",
    entry5: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation guard - redirect if no user info
  useEffect(() => {
    const userInfo = getFromLocalStorage("userInfo");
    if (!userInfo) {
      toast({
        title: "Session Required",
        description: "Please start from the beginning to collect your information.",
        variant: "destructive",
      });
      navigate("/info");
    }
  }, [navigate, toast]);

  // Load saved entries on mount
  useEffect(() => {
    const savedEntries = getFromLocalStorage("draftEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
      } catch (error) {
        console.error("Error parsing saved entries:", error);
      }
    }
  }, []);

  // Save entries to localStorage as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToLocalStorage("draftEntries", JSON.stringify(entries));
    }, 1000); // Debounce by 1 second

    return () => clearTimeout(timeoutId);
  }, [entries]);

  const placeholders = [
    "Example: I have to pay rent in cash. Like… actual paper.",
    "Example: Can't make international payment without a passport endorsed card",
    "Example: No way to verify if a landlord is a scammer or just terrible.",
    "What else drives you crazy?",
    "One more thing that needs fixing..."
  ];

  const handleEntryChange = (entryNumber: string, value: string) => {
    setEntries(prev => ({ ...prev, [entryNumber]: value }));
  };

  const formatDiscordMessage = (userInfo: { fullName: string; email: string; phone: string }, entries: { entry1: string; entry2: string; entry3: string; entry4: string; entry5: string }) => {
    // Calculate the maximum width needed for the table
    const maxNameLength = Math.max(userInfo.fullName.length, 20);
    const maxEmailLength = Math.max(userInfo.email.length, 20);
    const maxPhoneLength = Math.max(userInfo.phone.length, 15);
    const maxWidth = Math.max(maxNameLength, maxEmailLength, maxPhoneLength, 30) + 10;
    
    // Create dynamic borders
    const topBorder = '+' + '-'.repeat(maxWidth + 2) + '+';
    const separator = '+' + '-'.repeat(maxWidth + 2) + '+';
    
    return `\`\`\`
${topBorder}
|${' '.repeat(Math.floor((maxWidth - 9) / 2))}User Info${' '.repeat(Math.ceil((maxWidth - 9) / 2))}|
${separator}
| Name:  ${userInfo.fullName.padEnd(maxWidth - 7)}|
| Email: ${userInfo.email.padEnd(maxWidth - 7)}|
| Phone: ${userInfo.phone.padEnd(maxWidth - 7)}|
${topBorder}
\`\`\`

**Full Entries:**
${entries.entry1 ? `**Entry 1:** ${entries.entry1}` : ''}
${entries.entry2 ? `**Entry 2:** ${entries.entry2}` : ''}
${entries.entry3 ? `**Entry 3:** ${entries.entry3}` : ''}
${entries.entry4 ? `**Entry 4:** ${entries.entry4}` : ''}
${entries.entry5 ? `**Entry 5:** ${entries.entry5}` : ''}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entries.entry1.trim()) {
      toast({
        title: "Missing Entry",
        description: "Please fill in at least the first entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Get user info from localStorage
    const userInfo = getFromLocalStorage("userInfo");
    console.log("Retrieved userInfo from localStorage:", userInfo);
    
    if (!userInfo) {
      toast({
        title: "Session Expired",
        description: "Please start over from the beginning.",
        variant: "destructive",
      });
      navigate("/info");
      return;
    }

    let parsedUserInfo;
    try {
      parsedUserInfo = JSON.parse(userInfo);
      console.log("Parsed userInfo:", parsedUserInfo);
      console.log("Current entries:", entries);
    } catch (error) {
      console.error("Error parsing user info:", error);
      toast({
        title: "Session Error",
        description: "Please start over from the beginning.",
        variant: "destructive",
      });
      navigate("/info");
      return;
    }
    
    // Retry logic for submission
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Send to Discord webhook
        const discordMessage = formatDiscordMessage(parsedUserInfo, entries);
        
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
        console.log("Webhook URL configured:", !!webhookUrl);
        
        if (!webhookUrl) {
          throw new Error("Discord webhook URL not configured. Please contact support.");
        }
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: discordMessage
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Discord API Error:", response.status, errorText);
          throw new Error(`Discord API error: ${response.status} - ${response.statusText}`);
        }

        // Clear localStorage after successful submission
        removeFromLocalStorage("userInfo");
        removeFromLocalStorage("draftEntries");
        
        setIsSubmitting(false);
        navigate("/thank-you");
        return;
        
      } catch (error) {
        attempt++;
        console.error(`Submission attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    
    // All attempts failed
    const errorMessage = attempt === 1 ? 
      "Unable to submit your entries. Please check your internet connection and try again." :
      `Failed to submit after ${maxRetries} attempts. Please try again later or contact support if the problem persists.`;
    
    toast({
      title: "Submission Failed",
      description: errorMessage,
      variant: "destructive",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Card className="bg-card border-border shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold font-satoshi">
              Time to Rant
            </CardTitle>
            <p className="text-muted-foreground text-sm md:text-base">
              What's broken, annoying, or just dumb — and needs to be better? Tell us 5 things that make you go "why the hell is this still a thing!"
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <Label htmlFor={`entry${num}`} className="text-sm font-medium">
                    Entry {num} {num === 1 && <span className="text-primary">*</span>}
                  </Label>
                  <Textarea
                    id={`entry${num}`}
                    value={entries[`entry${num}` as keyof typeof entries]}
                    onChange={(e) => handleEntryChange(`entry${num}`, e.target.value)}
                    placeholder={placeholders[num - 1]}
                    className="min-h-[100px]"
                    required={num === 1}
                  />
                </div>
              ))}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full font-satoshi text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Your Rants..." : "Send"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-[120px] animate-pulse" />
      </div>
    </div>
  );
};

export default Submission;