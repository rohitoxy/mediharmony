
import { motion } from "framer-motion";
import { Beaker } from "lucide-react";

interface TestOptionProps {
  onSelect: () => void;
}

const TestOption = ({ onSelect }: TestOptionProps) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-border/50 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-60" />
      
      <div className="relative z-10 p-6 flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-purple-100 mb-4">
          <Beaker className="h-8 w-8 text-purple-500" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-purple-800">Test Suite</h3>
        
        <p className="text-gray-600 mb-4">
          Run comprehensive tests to verify application functionality
        </p>
        
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            Unit Tests
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Integration Tests
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestOption;
