import moment from "moment";

export const transformTask = (task) => ({
  ...task,
  // startDate: moment(task.startDate, "MM/DD/YYYY"),
  // dueDate: moment(task.dueDate, "MM/DD/YYYY"),
});

export const filterTask =
  ({ day, noComplete } = { day: moment().startOf("day"), noComplete: true }) =>
  (task) => {
    if (task.dueDate.isBefore(day)) return false;
    else if (
      noComplete &&
      task.completes.length === task.completes.filter((item) => item).length
    )
      return false;
    return true;
  };

/**
 * @param {moment.Moment} day
 */
export const filterDayTask =
  (day, logOutput = false) =>
  /**
   *
   * @param {import('../../../../types').task} task
   * @returns
   */
  (task) => {
    const log = (...args) =>
      logOutput && import.meta.env.DEV ? console.log(...args) : false;
    const today = moment(day.format("MM/DD/YYYY"), "MM/DD/YYYY");
    // day before task start date: false
    if (day.isBefore(task.startDate)) return log("before", task.name) || false;
    // task completed: false
    if (task.completes.length === task.completes.filter((item) => item).length)
      return log("Completed", task.name) || false;
    // task overdue: true
    if (task.dueDate.isBefore(today.add(1, "day"), "day"))
      return log("overdue", task.name) || true;
    // do it all at once task: true
    if (task.timeConf === "once") return log("timeConf: once,", task.name);
    // task progress % is less than time progress %: true
    // also make sure no division by 0 somehow
    const taskCompletionPercent =
      task.completes.filter((item) => item).length /
      (task.completes.length || 1);
    const timeCompletionPercent =
      day.diff(task.startDate, "day") /
      task.dueDate.diff(task.startDate, "day");
    if (taskCompletionPercent <= timeCompletionPercent)
      return log("progressed", task.name) || true;
    // otherwise false
    log(
      taskCompletionPercent,
      timeCompletionPercent,
      day.format("MM/DD/YYYY"),
      task.startDate.format("MM/DD/YYYY")
    );
    return false;
  };
