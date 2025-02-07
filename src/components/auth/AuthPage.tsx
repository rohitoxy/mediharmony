
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-6 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6 gap-2 relative z-10"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Button>
      <div className="max-w-md mx-auto relative z-10">
        <LoginForm onSuccess={() => {
          console.log("Login successful");
        }} />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <UserPlus className="w-4 h-4" />
              Create New Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <LoginForm onSuccess={() => {
              console.log("Signup successful");
            }} isSignUp />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AuthPage;
