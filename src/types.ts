export type Fraction = {
  numerator: number;
  denominator: number;
};

export type Question = {
  id: string;
  fraction: Fraction;
  options: Fraction[];
  correctAnswer: Fraction;
  type: 'identify' | 'visualize'; // identify: what fraction is this? visualize: pick the correct shape
};
