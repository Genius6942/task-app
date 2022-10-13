type cardState = {
  id: number;
  text: string;
  color?: string;
  time?: string;
  title: string;
  completed: boolean;
};
type colState = {
  id: number;
  title: string;
  color: string;
  items: cardState[];
};

type task = {
  
}

export type { cardState, colState };
