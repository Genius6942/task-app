import moment from "moment";

export const transformTask = (task) => ({
  ...task,
  startDate: moment(task.startDate, "MM/DD/YYYY"),
  dueDate: moment(task.dueDate, "MM/DD/YYYY"),
});
