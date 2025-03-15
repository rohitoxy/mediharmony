
import { motion } from "framer-motion";
import { Pill, Stethoscope, User, Clock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onInterfaceSelect: (interfaceType: "doctor" | "nurse") => void;
}

const LandingPage = ({ onInterfaceSelect }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
      
      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Clock, Pill, AlertCircle, Check].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-slate-300"
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
            <Pill className="w-12 h-12 text-[#A5D8FF]" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-slate-700 mt-4">
            Med Alert
          </h1>
          <p className="text-xl text-slate-600 max-w-xs mx-auto mt-2">
            Efficient medication management system for healthcare professionals
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Choose your interface</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                className="w-full sm:w-48 h-14 text-base shadow-lg bg-[#A5D8FF] hover:bg-[#8ECAFF] text-slate-700 font-medium gap-2 group"
                onClick={() => onInterfaceSelect("doctor")}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="bg-white/20 p-1.5 rounded-full"
                >
                  <Stethoscope className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">
                  Doctor Interface
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                className="w-full sm:w-48 h-14 text-base shadow-lg bg-[#A5D8FF] hover:bg-[#8ECAFF] text-slate-700 font-medium gap-2 group"
                onClick={() => onInterfaceSelect("nurse")}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="bg-white/20 p-1.5 rounded-full"
                >
                  <User className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">
                  Nurse Interface
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center text-xs text-slate-500 mt-auto py-4"
      >
        © {new Date().getFullYear()} Med Alert System • All Rights Reserved
      </motion.div>
    </div>
  );
};

export default LandingPage;
