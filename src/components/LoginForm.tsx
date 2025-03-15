
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User } from "lucide-react";

const LoginForm = ({ onSuccess, isSignUp = false }: { onSuccess: () => void; isSignUp?: boolean }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Check if passwords match
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Account created successfully",
          });
          onSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={isSignUp}
            placeholder="Your Name"
            className="pl-10 py-6 bg-transparent border-b border-slate-300 rounded-none focus:ring-0 focus:border-slate-500"
          />
        </div>
      )}
      
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={isSignUp ? "Your Email" : "Enter your Email"}
          className="pl-10 py-6 bg-transparent border-b border-slate-300 rounded-none focus:ring-0 focus:border-slate-500"
        />
      </div>
      
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={isSignUp ? "Your Password" : "Enter your Password"}
          className="pl-10 py-6 bg-transparent border-b border-slate-300 rounded-none focus:ring-0 focus:border-slate-500"
        />
      </div>
      
      {isSignUp && (
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={isSignUp}
            placeholder="Confirm Password"
            className="pl-10 py-6 bg-transparent border-b border-slate-300 rounded-none focus:ring-0 focus:border-slate-500"
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full py-6 mt-8 bg-[#A5D8FF] hover:bg-[#8ECAFF] text-slate-700 font-medium text-lg"
        disabled={loading}
      >
        {isSignUp ? (
          loading ? "Creating Account..." : "Sign up"
        ) : (
          loading ? "Logging in..." : "Continue"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
