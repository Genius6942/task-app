// mui
import { styled, useTheme } from "@mui/material/styles";

import {
  Checkbox,
  Collapse,
  FormControl,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Circle, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

import CheckBox from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import ColorLens from "@mui/icons-material/ColorLens";
import Delete from "@mui/icons-material/Delete";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";

import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Suspense, forwardRef, lazy, useState } from "react";
import { useEffect } from "react";
import { TwitterPicker } from "react-color";

import moment from "moment";

import { useConfetti } from "../../../../components/confetti";
import { useForceUpdate, useSmallScreen } from "../../../../lib/utils";

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
 * @param { import('../../../types').cardState } props.taskData
 * @param {(newState: import('../../../types').cardState ) => void} props.onChange
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
  if (placeholder) {
    return <div style={{ width: customWidth || 398, height: 161 }}></div>;
  }

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded(!expanded);

  const [data, setData] = useState({
    ...taskData,
    startDate: moment(taskData.startDate, "MM/DD/YYYY"),
    dueDate: moment(taskData.dueDate, "MM/DD/YYYY"),
  });
  useEffect(() => {
    setData({
      ...taskData,
      startDate: moment(taskData.startDate, "MM/DD/YYYY"),
      dueDate: moment(taskData.dueDate, "MM/DD/YYYY"),
    });
  }, [taskData]);
  /**
   * @param {Partial<data>} newData
   */
  const updateData = (newData) => {
    const values = { ...newData };
    return setData({ ...data, ...values });
  };

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

  const [editing, setEditing] = useState(false);

  const smallScreen = useSmallScreen();

  const { createConfetti } = useConfetti();

  // task status:
  // 1: good / green
  // 2: warn / orange
  // 3: bad / red
  const generateTaskStatus = () => {
    if (data.dueDate.isBefore(moment().startOf("day"))) return 3;
    else if (
      data.completes.filter((item) => item).length <
      moment.duration(moment().startOf("day").diff(data.startDate)).asDays()
    )
      return 2;
    else return 1;
  };
  const taskStatus = generateTaskStatus();

  return (
    <FormControl variant="standard">
      <Card
        sx={{
          width: customWidth || (smallScreen ? 350 : 450),
          backgroundColor: taskData.color || theme.palette.bgGrey,
          overflow: "visible",
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          setEditing(true);
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
                      (taskStatus === 1
                        ? "On track"
                        : taskStatus === 2
                        ? "Not on track"
                        : "Over due")
                    }
                  >
                    <span>
                      <IconButton disabled>
                        <Circle
                          color={
                            taskStatus === 1
                              ? "success"
                              : taskStatus === 2
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
                <IconButton onClick={() => onRemove()}>
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
              <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
                <Typography whiteSpace="nowrap">
                  Task progress ({data.completes.filter((item) => item).length}/
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

                        const formatedData = {
                          ...data,
                          completes: completesCopy,
                          startDate: data.startDate.format("MM/DD/YYYY"),
                          dueDate: data.dueDate.format("MM/DD/YYYY"),
                        };
                        onChange(formatedData);
                      }}
                    />
                  ))}
                </Box>
              </Stack>
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
                    onChange={(newValue) => updateData({ startDate: newValue })}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    variant="standard"
                    mobile={smallScreen}
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={data.dueDate}
                    onChange={(newValue) => updateData({ dueDate: newValue })}
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
