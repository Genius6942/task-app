import { useTheme } from "@mui/material/styles";

import { Box, Button, Stack, Typography } from "@mui/material";

/**
 * Author: Nikolai Tschacher
 * Updated: 27.08.2022
 * Website: https://incolumitas.com/
 *
 * Detect uBlock Origin, Adblock Plus and Ghostery with JavaScript only
 *
 * Usage: detectAdblock().then((res) => { console.log(res) });
 *
 */
export function detectAdblock() {
  const adblockTests = {
    // https://github.com/uBlockOrigin/uAssets/blob/master/filters/filters-2022.txt
    uBlockOrigin: {
      url: "https://incolumitas.com/data/pp34.js?sv=",
      id: "837jlaBksSjd9jh",
    },
    // https://github.com/easylist/easylist/blob/master/easylist/easylist_general_block.txt
    adblockPlus: {
      url: "https://incolumitas.com/data/neutral.js?&ad_height=",
      id: "hfuBadsf3hFAk",
    },
  };

  function canLoadRemoteScript(obj) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");

      script.onload = function () {
        if (document.getElementById(obj.id)) {
          resolve(false);
        } else {
          resolve(true);
        }
      };

      script.onerror = function () {
        resolve(true);
      };

      script.src = obj.url;
      document.body.appendChild(script);
    });
  }

  return new Promise(function (resolve, reject) {
    let promises = [
      canLoadRemoteScript(adblockTests.uBlockOrigin),
      canLoadRemoteScript(adblockTests.adblockPlus),
    ];

    Promise.all(promises)
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onForceClose
 */
export function AdBlockModal({ open, onForceClose }) {
  const theme = useTheme();
  return open && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: "0",
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,.3)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          p: 3,
          background: "white",
          borderRadius: 10,
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontSize={theme.typography.h3}>
          Looks like you have an adblocker.
        </Typography>
        <Typography>
          Ad blockers can interfere with the database transfers in this site and
          prevent proper functionality.
          <br />
          We don't <strong>ever</strong> track you or display ads, as we want
          this service to be free for everyone.
          <br />
          Please disable your ad blocker, then reload the page.
        </Typography>
        <Stack gap={1} direction="row " sx={{ mx: "auto" }}>
          <Button variant="text" onClick={onForceClose}>
            I don't have an ad blocker
          </Button>
          <Button variant="text" onClick={() => history.go(0)}>
            Reload
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
