
import { Pill, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onLogout: () => void;
  onBack: () => void;
  showLogout?: boolean;
}

const AppHeader = ({ onLogout, onBack, showLogout }: AppHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-white p-3 rounded-full shadow-md">
          <Pill className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Med Alert</h1>
      </div>
      <div className="flex gap-4">
        {showLogout && (
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
