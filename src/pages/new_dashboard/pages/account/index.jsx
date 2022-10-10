import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";

import { DarkMode, LightMode } from "@mui/icons-material";

import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { motion } from "framer-motion";

import { app_name } from "../../../../lib/constants";
import { auth } from "../../../../lib/firebase";
import {
  getUser,
  updateProfilePicture,
  updateUser,
} from "../../../../lib/firebase/firestore/user";
import Subjects from "../../components/subjects";
import EditableInfo from "./editableInfo";

export default function Account({ changeTheme }) {
  const [user, loading, error] = useAuthState(auth);

  const [accountData, setAccountData] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const data = await getUser(user.uid);
      setAccountData(data);
    })();
    setUserProfilePicture(user.photoURL);
  }, [user, loading]);

  const theme = useTheme();

  useEffect(() => {
    if (accountData) {
      updateUser(user.uid, accountData);
    }
  }, [accountData]);

  const updatePhoto = () => {
    const fileUploadElement = document.createElement("input");

    const allowedFileTypes = [".png", ".jpg", ".svg"];
    fileUploadElement.type = "file";
    fileUploadElement.accept = allowedFileTypes.join(",");

    fileUploadElement.click();

    fileUploadElement.addEventListener("change", async () => {
      const file = fileUploadElement.files[0];
      if (
        file &&
        allowedFileTypes.includes(file.name.substring(file.name.length - 4))
      ) {
        console.log("file valid");
        if (file.size > 2 ** 18) {
          // file bigger than 256 kb
          alert("Image bigger than maximum size of 256kb.");
          return;
        }
        setUserProfilePicture(null);

        const generatedPhotoUrl = await updateProfilePicture(user, file);
        user.reload();
        setUserProfilePicture(generatedPhotoUrl);
      } else {
        console.log(file ? file.name : "no file");
        if (file) {
          alert(
            "Invalid image type: " + file.name.substring(file.name.length - 4)
          );
        }
      }
    });
  };

  const settings = [
    {
      name: "Your info",
      component: (
        <EditableInfo
          data={accountData || {}}
          fields={[{ name: "Name", key: "name" }]}
          updateData={(newData) => setAccountData({ accountData, ...newData })}
        />
      ),
    },
    {
      name: "Subjects",
      component: (
        <Subjects
          subjects={(accountData && accountData.subjects) || []}
          updateSubjects={(newValue) =>
            setAccountData({ ...accountData, subjects: newValue })
          }
        />
      ),
    },
    {
      name: "Site settings",
      component: (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          <Typography sx={{ mx: 1 }}>Theme (beta)</Typography>
          <Switch
            edge="end"
            onChange={({ target }) => changeTheme({ dark: target.checked })}
            checked={theme.palette.mode === "dark"}
          />
        </Box>
      ),
    },
    {
      name: "Actions",
      component: (
        <Box>
          <Button
            onClick={() => auth.signOut()}
            fullWidth
            variant="outlined"
            color="error"
          >
            Log Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {accountData ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "auto",
            width: "100%",
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              borderBottom: `3px solid ${
                theme.palette.mode === "dark" ? "white" : "black"
              }`,
            }}
          >
            <Typography fontSize={30} mr={3}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                Welcome,{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {accountData.name || app_name + " user"}.
              </motion.span>
            </Typography>
            {userProfilePicture ? (
              <Avatar
                alt={user && user.displayName}
                src={userProfilePicture}
                sx={{ mb: 1, cursor: "pointer" }}
                onClick={updatePhoto}
              >
                {user && !user.photoURL && user.displayName}
              </Avatar>
            ) : (
              <CircularProgress sx={{ mb: 1 }} />
            )}
          </Box>
          <Stack gap={4} mt={3}>
            {accountData &&
              settings.map((setting, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * idx + 1.1 }}
                  style={{
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      width: 350,
                      borderRadius: 5,
                      background:
                        theme.palette.mode !== "dark"
                          ? theme.palette.grey[300]
                          : theme.palette.grey[900],
                    }}
                  >
                    <Typography fontWeight="bold">{setting.name}</Typography>
                    {setting.component}
                  </Box>
                </motion.div>
              ))}
          </Stack>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
