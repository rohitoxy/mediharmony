
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Cell } from "recharts";
import { Users, UserRound } from "lucide-react";
import { motion } from "framer-motion";

// Sample data for patient statistics
// In a real application, this would come from a database
const dummyPatientData = [
  { name: "Room 101", patients: 2, color: "#8b5cf6" },
  { name: "Room 102", patients: 1, color: "#6366f1" },
  { name: "Room 103", patients: 3, color: "#3b82f6" },
  { name: "Room 104", patients: 2, color: "#2dd4bf" },
  { name: "Room 105", patients: 1, color: "#10b981" },
];

export function PatientStatistics() {
  const totalPatients = dummyPatientData.reduce((acc, curr) => acc + curr.patients, 0);
  
  const chartConfig = {
    patients: {
      label: "Patients",
      color: "#8b5cf6",
    },
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Patient Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[250px] mt-2">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyPatientData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Bar 
                    dataKey="patients" 
                    radius={[4, 4, 0, 0]} 
                    barSize={35}
                  >
                    {dummyPatientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <ChartTooltip
                    content={({ active, payload }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value) => [`${value} Patients`, 'Patients']}
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Total Patients
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col items-center justify-center h-[200px]">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl transform scale-90"></div>
              <div className="bg-gradient-to-r from-primary/20 to-primary/30 rounded-full p-8 shadow-inner relative mb-2">
                <div className="text-6xl font-bold text-primary">{totalPatients}</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-6">
              Currently admitted patients
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
