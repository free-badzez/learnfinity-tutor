
// This is a placeholder for Gemini API integration
// In a production environment, you would need proper API key management

interface QuestionResponse {
  question: string;
  answer: string;
  explanation: string;
}

export const generateMathQuestions = async (
  topic: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number = 5
): Promise<QuestionResponse[]> => {
  // In a real implementation, this would make an API call to Gemini
  // For now, we'll simulate the response with a delay
  
  console.log(`Generating ${count} ${difficulty} questions for ${topic}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate simulated questions based on topic and difficulty
      const questions: QuestionResponse[] = [];
      
      for (let i = 0; i < count; i++) {
        if (topic === "Algebra") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Solve for x: ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = ${Math.floor(Math.random() * 30)}`,
              answer: `${Math.floor(Math.random() * 10)}`,
              explanation: `Step 1: Move the constant to the right side\nStep 2: Divide both sides by the coefficient of x`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Solve the quadratic equation: ${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = 0`,
              answer: `x = ${Math.floor(Math.random() * 5) - 2}, ${Math.floor(Math.random() * 5) - 2}`,
              explanation: `Use the quadratic formula x = (-b ± √(b² - 4ac)) / 2a\nSubstitute the values and solve`
            });
          } else {
            questions.push({
              question: `Find all values of x that satisfy: |${Math.floor(Math.random() * 5) + 1}x - ${Math.floor(Math.random() * 10)}| > ${Math.floor(Math.random() * 15)}`,
              answer: `x < ${Math.floor(Math.random() * 5) - 10} or x > ${Math.floor(Math.random() * 10) + 5}`,
              explanation: `Step 1: Set up the two cases based on the absolute value\nStep 2: Solve each inequality`
            });
          }
        } else if (topic === "Geometry") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the area of a rectangle with length ${Math.floor(Math.random() * 10) + 5} units and width ${Math.floor(Math.random() * 10) + 3} units.`,
              answer: `${(Math.floor(Math.random() * 10) + 5) * (Math.floor(Math.random() * 10) + 3)} square units`,
              explanation: `Area of rectangle = length × width\nSubstitute the values and multiply`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Find the volume of a cone with radius ${Math.floor(Math.random() * 5) + 3} units and height ${Math.floor(Math.random() * 10) + 5} units. Use π = 3.14.`,
              answer: `${Math.floor(((Math.floor(Math.random() * 5) + 3) ** 2 * (Math.floor(Math.random() * 10) + 5) * 3.14) / 3)} cubic units`,
              explanation: `Volume of a cone = (1/3) × π × r² × h\nSubstitute the values and calculate`
            });
          } else {
            questions.push({
              question: `In triangle ABC, angle A = ${Math.floor(Math.random() * 30) + 30}°, angle B = ${Math.floor(Math.random() * 30) + 40}°, and side c = ${Math.floor(Math.random() * 10) + 8} units. Find the area of the triangle using the law of sines.`,
              answer: `${Math.floor(Math.random() * 50) + 30} square units`,
              explanation: `Step 1: Find angle C using the fact that angles in a triangle sum to 180°\nStep 2: Use the formula Area = (1/2) × c × a × sin(B)`
            });
          }
        } else if (topic === "Calculus") {
          if (difficulty === "Easy") {
            questions.push({
              question: `Find the derivative of f(x) = ${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 3) + 2} + ${Math.floor(Math.random() * 10)}x.`,
              answer: `f'(x) = ${(Math.floor(Math.random() * 5) + 1) * (Math.floor(Math.random() * 3) + 2)}x^${Math.floor(Math.random() * 3) + 1} + ${Math.floor(Math.random() * 10)}`,
              explanation: `Use the power rule: d/dx(x^n) = n×x^(n-1)\nApply to each term and simplify`
            });
          } else if (difficulty === "Medium") {
            questions.push({
              question: `Evaluate the indefinite integral ∫(${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 2) + 1} + ${Math.floor(Math.random() * 10)}e^x) dx.`,
              answer: `${Math.floor(Math.random() * 5) + 1}x^${Math.floor(Math.random() * 2) + 2}/${Math.floor(Math.random() * 2) + 2} + ${Math.floor(Math.random() * 10)}e^x + C`,
              explanation: `For x^n, the integral is x^(n+1)/(n+1)\nFor e^x, the integral is e^x\nAdd the constant of integration C`
            });
          } else {
            questions.push({
              question: `Find the local extrema of the function f(x) = ${Math.floor(Math.random() * 5) + 1}x^3 - ${Math.floor(Math.random() * 10) + 5}x^2 + ${Math.floor(Math.random() * 15) + 10}x - ${Math.floor(Math.random() * 10)}`,
              answer: `Local minimum at x = ${Math.floor(Math.random() * 2) + 1}, local maximum at x = ${Math.floor(Math.random() * 3) + 3}`,
              explanation: `Step 1: Find f'(x) and set it equal to 0\nStep 2: Solve for x\nStep 3: Determine whether each critical point is a maximum or minimum using the second derivative test`
            });
          }
        } else {
          // Default questions for other topics
          questions.push({
            question: `Question ${i + 1} for ${topic} (${difficulty} difficulty)`,
            answer: `Answer for question ${i + 1}`,
            explanation: `This is a detailed explanation for question ${i + 1} in the ${topic} category.`
          });
        }
      }
      
      resolve(questions);
    }, 1500); // Simulate API delay
  });
};
