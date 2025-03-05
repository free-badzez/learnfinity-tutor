
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator as CalculatorIcon } from 'lucide-react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevResult, setPrevResult] = useState('');

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const addDigit = (digit: string) => {
    if (display === '0' || prevResult !== '') {
      setDisplay(digit);
      setPrevResult('');
    } else {
      setDisplay(display + digit);
    }
  };

  const addDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const addOperator = (operator: string) => {
    setPrevResult('');
    setExpression(expression + display + operator);
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      // Using Function constructor to evaluate mathematical expressions
      // Note: In a production app, you might want a more secure approach
      const result = Function(`'use strict'; return (${fullExpression})`)();
      setDisplay(String(result));
      setExpression('');
      setPrevResult(String(result));
    } catch (error) {
      setDisplay('Error');
    }
  };

  return (
    <Card className="w-full max-w-[300px] shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <CalculatorIcon className="h-5 w-5 mr-2 text-tutor-blue" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 p-2 mb-3 rounded-md text-right min-h-10">
          <div className="text-xs text-gray-500">{expression}</div>
          <div className="text-xl font-medium">{display}</div>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          <Button 
            variant="outline" 
            onClick={clear}
            className="bg-gray-200 hover:bg-gray-300"
          >
            C
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addOperator('/')}
            className="bg-gray-100 hover:bg-gray-200"
          >
            ÷
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addOperator('*')}
            className="bg-gray-100 hover:bg-gray-200"
          >
            ×
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setDisplay(display.slice(0, -1) || '0')}
            className="bg-gray-100 hover:bg-gray-200"
          >
            ⌫
          </Button>
          
          {[7, 8, 9].map(num => (
            <Button 
              key={num} 
              variant="outline" 
              onClick={() => addDigit(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button 
            variant="outline" 
            onClick={() => addOperator('-')}
            className="bg-gray-100 hover:bg-gray-200"
          >
            -
          </Button>
          
          {[4, 5, 6].map(num => (
            <Button 
              key={num} 
              variant="outline" 
              onClick={() => addDigit(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button 
            variant="outline" 
            onClick={() => addOperator('+')}
            className="bg-gray-100 hover:bg-gray-200"
          >
            +
          </Button>
          
          {[1, 2, 3].map(num => (
            <Button 
              key={num} 
              variant="outline" 
              onClick={() => addDigit(String(num))}
            >
              {num}
            </Button>
          ))}
          <Button 
            variant="outline" 
            onClick={calculate}
            className="bg-tutor-blue text-white hover:bg-tutor-dark-blue row-span-2"
          >
            =
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => addDigit('0')}
            className="col-span-2"
          >
            0
          </Button>
          <Button 
            variant="outline" 
            onClick={addDecimal}
          >
            .
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
