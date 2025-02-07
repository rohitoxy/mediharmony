
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
      <div className="space-y-8 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 mb-8"
        >
          <div className="bg-white p-6 rounded-full shadow-lg">
            <Pill className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mt-4">Med Alert</h1>
          <p className="text-muted-foreground text-lg">Efficient Medication Management System</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              className="w-64 h-20 text-lg shadow-lg bg-primary hover:bg-primary/90 gap-3"
              onClick={() => onInterfaceSelect("doctor")}
            >
              <Stethoscope className="w-6 h-6" />
              Doctor Interface
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              className="w-64 h-20 text-lg shadow-lg bg-accent hover:bg-accent/90 gap-3"
              onClick={() => onInterfaceSelect("nurse")}
            >
              <User className="w-6 h-6" />
              Nurse Interface
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
