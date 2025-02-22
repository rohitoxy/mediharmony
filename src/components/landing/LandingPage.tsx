
import { motion } from "framer-motion";
import { Pill, Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onInterfaceSelect: (interfaceType: "doctor" | "nurse") => void;
}

const LandingPage = ({ onInterfaceSelect }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
      <div className="space-y-6 text-center relative z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-2"
        >
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Pill className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Med Alert</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Efficient Medication Management System</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              className="w-full sm:w-48 h-14 text-base shadow-lg bg-primary hover:bg-primary/90 gap-2"
              onClick={() => onInterfaceSelect("doctor")}
            >
              <Stethoscope className="w-4 h-4" />
              Doctor Interface
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              className="w-full sm:w-48 h-14 text-base shadow-lg bg-accent hover:bg-accent/90 gap-2"
              onClick={() => onInterfaceSelect("nurse")}
            >
              <User className="w-4 h-4" />
              Nurse Interface
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

