import { styled, useTheme } from "@mui/material/styles";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Collapse,
  Container,
  FormControl,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  CheckBoxOutlineBlank as CheckBox,
  Circle,
  Close,
  ColorLens,
  Delete,
  Edit,
  ExpandMore as ExpandMoreIcon,
  Save,
} from "@mui/icons-material";

import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { forwardRef, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import { useAuthState } from "react-firebase-hooks/auth";

import moment from "moment";

import { useConfetti } from "../../../../components/confetti";
import { useSnackbar } from "../../../../components/snackbar";
import { auth } from "../../../../lib/firebase";
import {
  createTask,
  removeTask,
} from "../../../../lib/firebase/firestore/task";
import { useForceUpdate, useSmallScreen } from "../../../../lib/utils";
import SubTaskEditor from "../../components/subTask";
import { useTasks } from "./context";

const DatePicker = ({ mobile, ...props }) =>
  mobile ? <MobileDatePicker {...props} /> : <DesktopDatePicker {...props} />;

const IconButtonForward = forwardRef((props, ref) => {
  const { expand, ...otherProps } = props;
  return <IconButton {...otherProps} ref={ref} />;
});

const ExpandMore = styled(IconButtonForward)(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  marginLeft: "auto",
}));

/**
 * @param {object} props
 * @param { import('../../../../types').task } props.taskData
 * @param {(newState: import('../../../../types').task ) => void} props.onChange
 * @param {boolean?} props.placeholder - makes the card invisible and not interactive
 * @param {() => void} props.onRemove
 * @param {number?} props.customWidth
 */
export default function Task({
  taskData,
  index,
  onChange,
  placeholder = false,
  onRemove,
  customWidth = null,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const theme = useTheme();
  /**
   * @param {import('react-color').ColorResult} color
   */
  const onColorChange = (color) => {
    const shallowCopy = { ...taskData };
    shallowCopy.color = color.hex;
    onChange(shallowCopy);
  };

  const snackbar = useSnackbar();

  const [editing, setEditing] = useState(false);

  const smallScreen = useSmallScreen();

  const { createConfetti } = useConfetti();

  if (placeholder) {
    return <div style={{ width: customWidth || 398, height: 161 }}></div>;
  }

  const [user, loading] = useAuthState(auth);
  const { fetchTaskUpdate } = useTasks();

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded(!expanded);

  const [data, setData] = useState(taskData);
  useEffect(() => {
    !editing && setData(taskData);
  }, [taskData]);
  /**
   * @param {Partial<data>} newData
   */
  const updateData = (newData) => {
    const values = { ...newData };
    return setData({ ...data, ...values });
  };

  useEffect(() => {
    if (!editing) {
      setData(taskData);
    }
  }, [editing]);

  const [timeForceUpdate, forceTimeUpdate] = useForceUpdate();

  const regexp = /(https?:\/\/[^\s]+)/g;

  const result = Array.from(data.details.matchAll(regexp), (m) => m[0]);

  const output = data.details
    .split(regexp)
    .filter((item) => !regexp.test(item));

  Array(result.length)
    .fill()
    .forEach((_, idx) => {
      output.splice(
        result.length - idx,
        0,
        <Link
          href={result[result.length - idx - 1]}
          target="_blank"
          rel="noopener"
        >
          {result[result.length - idx - 1]}
        </Link>
      );
    });

  const finalText = output.map((item, idx) => <span key={idx}>{item}</span>);

  // task status:
  // 1: good / green
  // 2: warn / orange
  // 3: bad / red

  const timeToday = Math.round(
    data.timeConf === "once"
      ? data.time
      : ((data.time / data.completes.length) *
          (data.completes.length -
            data.completes.filter((item) => item).length)) /
          Math.max(1, data.dueDate.diff(moment().startOf("day"), "day"))
  );

  const taskHours = Math.floor(timeToday / 60);
  const taskMinutes = timeToday % 60;

  return (
    <FormControl variant="standard">
      <Card
        sx={{
          width: customWidth || (smallScreen ? 375 : 450),
          backgroundColor: taskData.color || theme.palette.bgGrey,
          overflow: "visible",
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          // setEditing(true);
        }}
      >
        <CardActions disableSpacing>
          <Container
            sx={{ display: "flex" }}
            // override container padding
            style={{ padding: 0 }}
            maxWidth="lg"
          >
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                overflowX: "auto",
              }}
              className="nobar"
            >
              <Box
                sx={{
                  background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  paddingX: 1,
                  borderRadius: 5,
                  mr: 2,
                }}
              >
                <Typography fontSize={20} whiteSpace="nowrap">
                  {data.subject}
                </Typography>
              </Box>
              {editing ? (
                <>
                  <Typography
                    fontSize={18}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    sx={{ mt: 0.3 }}
                    fontStyle="italic"
                    fontWeight="bold"
                  >
                    Editing
                  </Typography>
                  <Tooltip title="Cancel">
                    <IconButton onClick={() => setEditing(false)}>
                      <Close />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title={data.dueDate.format("ddd MM/DD")}>
                  <Typography
                    fontSize={18}
                    sx={{ flexGrow: 1 }}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    Due {data.dueDate.format("ddd MM/DD")}
                  </Typography>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: "flex" }}>
              {data.completes.length >
                data.completes.filter((item) => item).length && (
                <>
                  <Tooltip title="Completed for today">
                    <IconButton
                      onClick={({ target }) => {
                        const rect = target.getBoundingClientRect();
                        createConfetti(rect.x, rect.y);
                        const completesCopy = [...data.completes];
                        if (
                          completesCopy.filter((item) => item).length ===
                          completesCopy.length
                        )
                          return;
                        else
                          completesCopy[
                            completesCopy.filter((item) => item).length
                          ] = true;
                        const formatedData = {
                          ...data,
                          startDate: data.startDate.format("MM/DD/YYYY"),
                          dueDate: data.dueDate.format("MM/DD/YYYY"),
                          completes: completesCopy,
                        };
                        onChange(formatedData);
                      }}
                    >
                      <CheckBox />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      "Status: " +
                      (data.status === 1
                        ? "On track"
                        : data.status === 2
                        ? "Not on track"
                        : "Overdue")
                    }
                  >
                    <span>
                      <IconButton disabled>
                        <Circle
                          color={
                            data.status === 1
                              ? "success"
                              : data.status === 2
                              ? "warning"
                              : "error"
                          }
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Delete">
                <IconButton
                  onClick={async () => {
                    const formatedData = {
                      ...data,
                      startDate: data.startDate.format("MM/DD/YYYY"),
                      dueDate: data.dueDate.format("MM/DD/YYYY"),
                    };

                    const deepCopy = JSON.parse(JSON.stringify(formatedData));
                    snackbar.openUndoSnackbar("Task deleted", async () => {
                      await createTask(user.uid, deepCopy);
                      fetchTaskUpdate();
                    });
                    // onRemove();
                    try {
                      await removeTask(data.id);
                      fetchTaskUpdate();
                    } catch (e) {
                      snackbar.openErrorSnackbar(
                        "Error: Failed to delete task. Try refreshing the page."
                      );
                      console.error(e);
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Container>
        </CardActions>
        <CardContent>
          <Box
            sx={{
              p: 1,
              pb: -2,
              borderRadius: 5,
              background: theme.palette.primary.main,
              mt: -2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {editing ? (
              <TextField
                defaultValue={data.name}
                onBlur={({ target }) => updateData({ name: target.value })}
                variant="standard"
                inputProps={{ style: { textAlign: "center" } }}
                fullWidth
                sx={{ mx: 2 }}
              />
            ) : (
              <Typography fontSize={20} fontWeight="bold" textAlign={"center"}>
                {data.name}
              </Typography>
            )}
          </Box>
          <Collapse in={!editing} timeout="auto" unmountOnExit>
            <Typography my={1}>
              Time:{" "}
              {taskHours !== 0 &&
                taskHours.toString() +
                  ` hour${taskHours != 1 ? "s" : ""}${taskMinutes ? "," : ""} `}
              {taskMinutes !== 0 && taskMinutes.toString() + " minutes"}
            </Typography>
          </Collapse>
          <Collapse in={editing || expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 1 }} />
            {editing ? (
              <TextField
                defaultValue={data.details}
                onBlur={({ target }) => updateData({ details: target.value })}
                multiline
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography whiteSpace="pre-wrap" textOverflow="ellipsis">
                {finalText}
              </Typography>
            )}
            {!editing && (
              <>
                <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
                  <Typography whiteSpace="nowrap">
                    Task progress (
                    {data.completes.filter((item) => item).length}/
                    {data.completes.length}):
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto",
                      overflowY: "hidden",
                      flexWrap: "none",
                    }}
                    className="nobar"
                  >
                    {data.completes.map((complete, idx) => (
                      <Checkbox
                        sx={{ my: -1 }}
                        key={idx}
                        checked={complete}
                        onChange={() => {
                          const completesCopy = [...data.completes];
                          const currentCompletes = completesCopy.filter(
                            (item) => item
                          ).length;
                          if (complete) {
                            // remove complete
                            completesCopy[currentCompletes - 1] = false;
                          } else {
                            // add complete
                            completesCopy[currentCompletes] = true;
                          }

                          const formattedData = {
                            ...data,
                            completes: completesCopy,
                            startDate: data.startDate.format("MM/DD/YYYY"),
                            dueDate: data.dueDate.format("MM/DD/YYYY"),
                          };
                          onChange(formattedData);
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
                {data.subTasks && data.subTasks.length > 0 && (
                  <Stack>
                    <Typography>Subtask progress:</Typography>
                    {data.subTasks.map((subTask, idx) => (
                      <Box
                        sx={{ display: "flex", alignItems: "center" }}
                        key={idx}
                      >
                        <Checkbox
                          checked={subTask.completed}
                          onChange={({ target }) => {
                            const copy = [...data.subTasks];
                            copy[
                              copy.findIndex((item) => item.id === subTask.id)
                            ].completed = !subTask.completed;
                            const formattedData = {
                              ...data,
                              subTasks: copy,
                              startDate: data.startDate.format("MM/DD/YYYY"),
                              dueDate: data.dueDate.format("MM/DD/YYYY"),
                            };
                            onChange(formattedData);
                          }}
                        />
                        {subTask.text}
                      </Box>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Collapse>
          <Collapse in={editing} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <FormControl variant="standard">
                <Stack gap={2}>
                  <DatePicker
                    mobile={smallScreen}
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={data.startDate}
                    onChange={
                      /**
                       * @param {moment.Moment} newValue
                       */
                      (newValue) => {
                        const copyValue = moment(
                          newValue.format("MM/DD/YYYY"),
                          "MM/DD/YYYY"
                        );
                        updateData({
                          startDate: newValue,
                          dueDate: data.dueDate.isBefore(
                            copyValue.add(1, "day")
                          )
                            ? copyValue.add(1, "day")
                            : data.dueDate,
                        });
                      }
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    variant="standard"
                    mobile={smallScreen}
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={data.dueDate}
                    onChange={
                      /**
                       * @param {moment.Moment} newValue
                       */
                      (newValue) => {
                        newValue = newValue.startOf("day");
                        const copyNewValue = moment(
                          newValue.format("MM/DD/YYYY"),
                          "MM/DD/YYYY"
                        );
                        const copyStartDate = moment(
                          data.startDate.format("MM/DD/YYYY"),
                          "MM/DD/YYYY"
                        );

                        updateData({
                          dueDate: newValue,
                          startDate: newValue.isBefore(
                            copyStartDate.add(1, "day")
                          )
                            ? copyNewValue.add(-2, "days")
                            : data.startDate,
                        });
                      }
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                    <TextField
                      key={timeForceUpdate}
                      variant="standard"
                      defaultValue={Math.floor(data.time / 60)}
                      sx={{ width: 42 }}
                      type="number"
                      autoComplete="off"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      onBlur={({ target }) => {
                        const value =
                          target.value.length === 0
                            ? 0
                            : parseInt(target.value);
                        updateData({
                          time: value * 60 + (data.time % 60),
                        });

                        forceTimeUpdate();
                      }}
                    />
                    <Typography>hours</Typography>
                    <TextField
                      key={timeForceUpdate + 10 ** 6}
                      variant="standard"
                      defaultValue={data.time % 60}
                      sx={{ width: 42 }}
                      type="number"
                      autoComplete="off"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      onBlur={({ target }) => {
                        const value =
                          target.value.length === 0
                            ? 0
                            : parseInt(target.value);
                        updateData({
                          time: value + Math.floor(data.time / 60) * 60,
                        });

                        forceTimeUpdate();
                      }}
                    />
                    <Typography>minutes</Typography>
                  </Box>
                  {data.subTasks && data.subTasks.length > 0 && (
                    <SubTaskEditor
                      subTasks={data.subTasks}
                      onChange={(newSubTasks) =>
                        updateData({ subTasks: newSubTasks })
                      }
                    />
                  )}
                </Stack>
              </FormControl>
            </LocalizationProvider>
          </Collapse>
          <Box sx={{ display: "flex", mb: -2 }}>
            {editing ? (
              <Tooltip title="Cancel">
                <IconButton onClick={() => setEditing(false)}>
                  <Close />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Edit">
                <IconButton onClick={() => setEditing(true)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {false && (
              <Tooltip title="Color">
                <IconButton
                  sx={{ position: "relative" }}
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                >
                  <ColorLens />
                  {colorPickerOpen ? (
                    <Box
                      sx={{ position: "absolute", top: "110%", right: "0" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TwitterPicker
                        color={taskData.color}
                        triangle="top-right"
                        onChange={onColorChange}
                      />
                    </Box>
                  ) : null}
                </IconButton>
              </Tooltip>
            )}
            {!editing ? (
              <Tooltip title="Expand">
                <ExpandMore
                  expand={expanded}
                  aria-expanded={expanded}
                  aria-label="show more"
                  onClick={handleExpandClick}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Tooltip>
            ) : (
              <Tooltip title="Save">
                <IconButton
                  onClick={() => {
                    setEditing(false);
                    const formatedData = {
                      ...data,
                      startDate: data.startDate.format("MM/DD/YYYY"),
                      dueDate: data.dueDate.format("MM/DD/YYYY"),
                    };
                    onChange(formatedData);
                  }}
                  sx={{ ml: "auto" }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </FormControl>
  );
}
