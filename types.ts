
export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface LoveLetterParams {
  trait1: string;
  trait2: string;
  favoriteMemory: string;
  tone: 'romantic' | 'poetic' | 'playful';
}
