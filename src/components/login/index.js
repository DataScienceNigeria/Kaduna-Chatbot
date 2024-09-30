import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function SignIn(props) {
  const [show, setShow] = useState(true);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  // Handle sending messages
  const handleLogin = () => {
    setShow(false);
    props.actionProvider.showButtons([
      "Microplan",
      "Ask me about Microplan",
      "Ask me About DHS",
      "Home birth",
    ]);
  };

  return (
    <>
      {show ? (
        <div
          style={{
            width: 300,
            marginLeft: "9.2%",
            marginTop: "20px",
            padding: "20px 15px",
            background: "#fff",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              textAlign: "left", // Align the helper text to the left
              color: "#3a3b3d",
            }}
          >
            Login
          </Typography>
          <TextField
            type="text"
            variant="outlined"
            placeholder="Enter your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            sx={{
              input: {
                padding: "7px", // Adjust padding
                height: "30px", // Reduce input height
                fontSize: "13px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e6237e", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#ff4081", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff4081", // Focus border color
                },
              },
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              textAlign: "left", // Align the helper text to the left
              color: "#3a3b3d",
              fontSize: "10px",
            }}
          >
            {" "}
            Enter your phone number here
          </Typography>
          <TextField
            type="password"
            variant="outlined"
            placeholder="Enter your pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
            sx={{
              input: {
                padding: "7px", // Adjust padding
                height: "30px", // Reduce input height
                fontSize: "13px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e6237e", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#ff4081", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff4081", // Focus border color
                },
              },
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              textAlign: "left", // Align the helper text to the left
              color: "#3a3b3d",
              fontSize: "10px",
            }}
          >
            Enter your pin here
          </Typography>
          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
            }}
          >
            {/* <Button
              variant="outlined"
              sx={{
                borderColor: "#e6237e",
                color: "#e6237e",
                width: "35%",
              }}
            >
              Skip
            </Button> */}
            <Button
              variant="contained"
              style={{
                background: "#e6237e",
                fontWeight: 600,
                marginTop: "10px",
                width: "40%",
              }}
              onClick={() => handleLogin()}
            >
              Login{" "}
            </Button>
          </Box>
        </div>
      ) : null}
    </>
  );
}
