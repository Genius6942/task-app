import { Moment } from "moment";

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
  id: string;
  completes: boolean[];
  dueDate: Moment;
  startDate: Moment;
  owner: string;
  name: string;
  subTasks: { completed: boolean; id: number; text: string }[] | undefined;
  subject: string;
  time: number;
  timeConf: string;
};

export type { cardState, colState, task };
