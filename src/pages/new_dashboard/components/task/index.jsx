// mui
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";

// material icons
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import ColorLens from "@mui/icons-material/ColorLens";
import DragIndicator from "@mui/icons-material/DragIndicator";
import CheckBox from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import Save from "@mui/icons-material/Save";

import { TwitterPicker } from "react-color";
import { Suspense, useState, lazy, forwardRef } from "react";
import {
  Collapse,
  FormControl,
  Select,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { useSmallScreen } from "../../../../lib/utils";
import { useTheme } from "@mui/material/styles";

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
 * @param { import('../../../types').cardState } props.data
 * @param {(newState: import('../../../types').cardState ) => void} props.onChange
 * @param {boolean} props.placeholder - makes the card invisible and not interactive
 */
export default function Task({ data, index, onChange, placeholder = false }) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const theme = useTheme();
  /**
   * @param {import('react-color').ColorResult} color
   */
  const onColorChange = (color) => {
    const shallowCopy = { ...data };
    shallowCopy.color = color.hex;
    onChange(shallowCopy);
  };
  if (placeholder) {
    return <div style={{ width: 398, height: 161 }}></div>;
  }

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded(!expanded);

  const [name, setName] = useState(data.name || "");
  const [text, setText] = useState(data.details || "");

  const regexp = /(https?:\/\/[^\s]+)/g;

  const result = Array.from(text.matchAll(regexp), (m) => m[0]);

  const output = text.split(regexp).filter((item) => !regexp.test(item));

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

  const [startDateValue, setStartDateValue] = useState(
    moment(data.startDate, "MM/DD/YYYY")
  );
  const [dueDateValue, setDueDateValue] = useState(
    moment(data.dueDate, "MM/DD/YYYY")
  );

  const [taskMinutes, setTaskMinutes] = useState(3);

  const smallScreen = useSmallScreen();

  return (
    <Box sx={{ padding: 3 }}>
      <FormControl variant="standard">
        <Card
          sx={{
            width: 450,
            backgroundColor: data.color || "#cccccc",
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
                  overflow: "auto",
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
                  <Typography
                    fontSize={18}
                    sx={{ flexGrow: 1 }}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    Due {dueDateValue.format("ddd MM/DD")}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex" }}>
                <Tooltip title="Completed for today">
                  <IconButton>
                    <CheckBox />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onChange(null)}>
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
                  defaultValue={name}
                  onBlur={({ target }) => setName(target.value)}
                  variant="standard"
                  inputProps={{ style: { textAlign: "center" } }}
                  fullWidth
                  sx={{ mx: 2 }}
                />
              ) : (
                <Typography
                  fontSize={20}
                  fontWeight="bold"
                  textAlign={"center"}
                >
                  {name}
                </Typography>
              )}
            </Box>
            <Collapse in={editing || expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 1 }} />
              {editing ? (
                <TextField
                  defaultValue={text}
                  onBlur={({ target }) => setText(target.value)}
                  multiline
                  variant="standard"
                  fullWidth
                />
              ) : (
                <Typography whiteSpace="pre-wrap" textOverflow="ellipsis">
                  {finalText}
                </Typography>
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
                      value={startDateValue}
                      onChange={(newValue) => setStartDateValue(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                      variant="standard"
                      mobile={smallScreen}
                      label="Due Date"
                      inputFormat="MM/DD/YYYY"
                      value={dueDateValue}
                      onChange={(newValue) => setDueDateValue(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                      <TextField
                        variant="standard"
                        value={Math.floor(taskMinutes / 60)}
                        sx={{ width: 42 }}
                        onChange={(e) => {
                          let value = parseInt(e.target.value) || 0;
                          if (value < 0) {
                            value = 1;
                          } else if (value > 100) {
                            value = 100;
                          }

                          setTaskMinutes((taskMinutes % 60) + value * 60);
                        }}
                        onBlur={(e) => {
                          let value = parseInt(e.target.value) || 0;
                          if (value < 0) {
                            value = 1;
                          } else if (value > 100) {
                            value = 100;
                          }

                          setTaskMinutes((taskMinutes % 60) + value * 60);
                        }}
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 59 } }}
                      />
                      <Typography>hours</Typography>
                      <TextField
                        variant="standard"
                        value={taskMinutes % 60}
                        sx={{ width: 42 }}
                        onChange={(e) => {
                          let value = parseInt(e.target.value) || 0;
                          if (value < 0) {
                            value = 1;
                          } else if (value > 59) {
                            value = 59;
                          }

                          setTaskMinutes(
                            Math.floor(taskMinutes / 60) * 60 + value
                          );
                        }}
                        onBlur={(e) => {
                          let value = parseInt(e.target.value) || 0;
                          if (value < 0) {
                            value = 1;
                          } else if (value > 59) {
                            value = 59;
                          }

                          setTaskMinutes(
                            Math.floor(taskMinutes / 60) * 60 + value
                          );
                        }}
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 59 } }}
                      />
                      <Typography>minutes.</Typography>
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
              {true && (
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
                          color={data.color}
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
                    onClick={() => setEditing(false)}
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
    </Box>
  );
}
