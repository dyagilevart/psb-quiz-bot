export interface Solution {
  id: string;
  image?: string;
  text: string;
}

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  image?: string;
  text: string;
  answers: Answer[];
  solution: Solution;
}
