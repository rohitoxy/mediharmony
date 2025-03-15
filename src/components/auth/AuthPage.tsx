
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center p-6 relative">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-6 left-6 gap-2 text-slate-600"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-md">
        {isSignUp ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold mb-4 text-slate-700">Let's start!</h1>
              <p className="text-xl text-slate-600">Sign up for a free account</p>
            </div>
            
            <LoginForm 
              onSuccess={() => {
                console.log("Signup successful");
              }} 
              isSignUp={true} 
            />
            
            <div className="text-center mt-8">
              <p className="text-slate-600">
                Already have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="text-slate-700 font-medium hover:underline"
                >
                  Log In!
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold mb-4 text-slate-700">Welcome Back!</h1>
              <p className="text-xl text-slate-600">Sign in to your account</p>
            </div>
            
            <LoginForm 
              onSuccess={() => {
                console.log("Login successful");
              }} 
              isSignUp={false} 
            />
            
            <div className="text-center mt-8">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="text-slate-700 font-medium hover:underline"
                >
                  Sign up!
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
