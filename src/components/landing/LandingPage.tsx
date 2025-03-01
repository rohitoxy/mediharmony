
import { motion } from "framer-motion";
import { Pill, Stethoscope, User, Clock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onInterfaceSelect: (interfaceType: "doctor" | "nurse") => void;
}

const LandingPage = ({ onInterfaceSelect }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
      
      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Clock, Pill, AlertCircle, Check].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-primary/10"
            initial={{ 
              x: Math.random() * 100, 
              y: Math.random() * 100,
              opacity: 0.3,
              scale: 0.5 + Math.random() * 1.5
            }}
            animate={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              opacity: 0.1 + Math.random() * 0.3,
              rotate: Math.random() * 360
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15 + Math.random() * 10,
              repeatType: "reverse" 
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={20 + Math.random() * 40} />
          </motion.div>
        ))}
      </div>
      
      <div className="space-y-8 text-center relative z-10 px-6 max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-2"
        >
          <motion.div 
            className="bg-white p-5 rounded-full shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Pill className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mt-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Med Alert
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto mt-2">
            Efficient medication management system for healthcare professionals
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-medium text-gray-800 mb-4">Choose your interface</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full sm:w-48 h-14 text-base shadow-lg bg-primary hover:bg-primary/90 gap-2 group"
                onClick={() => onInterfaceSelect("doctor")}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="bg-white/20 p-1.5 rounded-full"
                >
                  <Stethoscope className="w-4 h-4" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">
                  Doctor Interface
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full sm:w-48 h-14 text-base shadow-lg bg-accent hover:bg-accent/90 gap-2 group"
                onClick={() => onInterfaceSelect("nurse")}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="bg-white/20 p-1.5 rounded-full"
                >
                  <User className="w-4 h-4" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">
                  Nurse Interface
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800">Easy Tracking</h3>
            <p className="text-sm text-muted-foreground">Track medication schedules efficiently</p>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800">Smart Alerts</h3>
            <p className="text-sm text-muted-foreground">Never miss an important medication</p>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800">Time Management</h3>
            <p className="text-sm text-muted-foreground">Optimize your medication schedule</p>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center text-xs text-muted-foreground mt-auto py-4"
      >
        © {new Date().getFullYear()} Med Alert System • All Rights Reserved
      </motion.div>
    </div>
  );
};

export default LandingPage;
