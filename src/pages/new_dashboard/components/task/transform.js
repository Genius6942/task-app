import moment from "moment";

export const transformTask = (task) => ({
  ...task,
  startDate: moment(task.startDate, "MM/DD/YYYY"),
  dueDate: moment(task.dueDate, "MM/DD/YYYY"),
});

export const filterTask =
  ({day, noComplete} = { day: moment().startOf('day'), noComplete: true }) =>
  (task) => {
    if (task.dueDate.isBefore(day)) return false;
    else if (
      noComplete &&
      task.completes.length === task.completes.filter((item) => item).length
    )
      return false;
    return true;
  };
