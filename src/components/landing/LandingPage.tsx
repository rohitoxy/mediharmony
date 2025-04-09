
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Stethoscope, Clipboard, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onInterfaceSelect: (interfaceType: string) => void;
}

const LandingPage = ({ onInterfaceSelect }: LandingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Med Alert
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-md mx-auto">
          Streamlined medication management for healthcare professionals
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="nurse">Nurse</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Doctor Interface
                </CardTitle>
                <CardDescription>
                  Prescribe and manage patient medications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Access the doctor interface to prescribe new medications, 
                  modify existing prescriptions, and view patient medication history.
                </p>
                <Button 
                  className="w-full group"
                  onClick={() => onInterfaceSelect("doctor")}
                >
                  Continue as Doctor
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  Nurse Interface
                </CardTitle>
                <CardDescription>
                  Administer and track patient medications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Access the nurse interface to view scheduled medications,
                  mark medications as administered, and receive timely alerts.
                </p>
                <Button 
                  className="w-full group"
                  onClick={() => onInterfaceSelect("nurse")}
                >
                  Continue as Nurse
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default LandingPage;
