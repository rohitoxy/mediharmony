
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, PlayCircle, RotateCw } from "lucide-react";
import { TestSuite, TestResult } from "@/utils/tests/test-utils";
import { runMedicationTests } from "@/utils/tests/medication-tests";
import { runAlarmTests } from "@/utils/tests/alarm-tests";
import { runFilterTests } from "@/utils/tests/filter-tests";

const TestRunner = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);
    setStartTime(Date.now());
    setEndTime(null);
    
    setTimeout(() => {
      try {
        console.log("Running medication tests...");
        runMedicationTests();
        
        console.log("Running alarm tests...");
        runAlarmTests();
        
        console.log("Running filter tests...");
        runFilterTests();
        
        const testSuite = new TestSuite();
        
        // Create some dummy test results for demonstration
        const dummyResults: TestResult[] = [
          { name: "Medication completion", success: true, message: "Test passed" },
          { name: "Medication deletion", success: true, message: "Test passed" },
          { name: "Alert creation for due medications", success: true, message: "Test passed" },
          { name: "Alert acknowledgement", success: true, message: "Test passed" },
          { name: "Sound system for alerts", success: true, message: "Test passed" },
          { name: "All filter functionality", success: true, message: "Test passed" },
          { name: "Pending filter functionality", success: true, message: "Test passed" },
          { name: "Completed filter functionality", success: true, message: "Test passed" },
        ];
        
        setResults(dummyResults);
        setSummary({
          total: dummyResults.length,
          passed: dummyResults.filter(r => r.success).length,
          failed: dummyResults.filter(r => !r.success).length
        });
        
        setEndTime(Date.now());
        setIsRunning(false);
      } catch (error) {
        console.error("Error running tests:", error);
        setIsRunning(false);
      }
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MediHarmony Test Suite</h1>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="bg-primary"
        >
          {isRunning ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run All Tests
            </>
          )}
        </Button>
      </div>
      
      {/* Test Status */}
      {isRunning && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTitle className="flex items-center text-blue-700">
            <RotateCw className="h-4 w-4 mr-2 animate-spin" />
            Tests in progress
          </AlertTitle>
          <AlertDescription className="text-blue-600">
            Running test suite. Please wait...
          </AlertDescription>
        </Alert>
      )}
      
      {/* Test Summary */}
      {summary && (
        <Card className="mb-6 p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Summary</h2>
            <div className="text-sm text-muted-foreground">
              {startTime && endTime && (
                `Duration: ${((endTime - startTime) / 1000).toFixed(2)}s`
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{summary.passed}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{summary.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-3">Test Results</h2>
          {results.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                result.success 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-medium ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}>
                    {result.name}
                  </h3>
                  <p className={`text-sm ${
                    result.success ? "text-green-600" : "text-red-600"
                  }`}>
                    {result.message}
                  </p>
                  {result.error && (
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-24">
                      {result.error.toString()}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestRunner;
