import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { TextField, Button, Box, Typography, Select } from "@mui/material";

export default function HomeBirthPrediction(props) {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [religion, setReligion] = useState("");
  const [last_birth_caesarean, setlast_birth_caesarean] = useState("");
  const [wanted_last_child, setwanted_last_child] = useState("");
  const [assistance_tba, setassistance_tba] = useState("");
  const [num_living_children, setnum_living_children] = useState(0);
  const [num_antenatal_visits, setnum_antenatal_visits] = useState(0);
  const [beating_justified_out, setbeating_justified_out] = useState("");
  const [health_care_decision, sethealth_care_decision] = useState("");
  const [husband_education, sethusband_education] = useState("");
  const [fertility_preference, setfertility_preference] = useState("");
  const [residing_with_partner, setresiding_with_partner] = useState("");

  // Handle sending messages
  const handlePredict = async () => {
    setShow(false);

    const postdata = {
      religion,
      last_birth_caesarean,
      num_living_children,
      wanted_last_child,
      num_antenatal_visits,
      residing_with_partner,
      fertility_preference,
      husband_education,
      beating_justified_out,
      health_care_decision,
      assistance_tba,
    };
    console.log(postdata);
    try {
      const response = await fetch(
        "https://api-utility-02885d450e64.herokuapp.com/predict/homebirth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Optional but useful to ensure the API returns JSON
          },
          body: JSON.stringify(postdata), // Convert the object to a JSON string
        }
      );
      const data = await response.json();
      if (data.error) {
        props.actionProvider.enterChatText(
          `Error fetching Home birth prediction details: ${data.error}`
        );
      }
      if (data.prediction === 1) {
        props.actionProvider.enterChatText(
          "There is an higher probabiblity of home birth"
        );
      } else if (data.prediction === 0) {
        props.actionProvider.enterChatText(
          "There is a lower probabiblity of home birth"
        );
      }
    } catch (error) {
      props.actionProvider.enterChatText(
        `Error fetching Home birth prediction details: ${error.message}`
      );
      console.error("Error sending question: ", error);
    }

    props.actionProvider.showButtons([
      "Select an option:",
      ["Microplan", "Ask me about Microplan", "Ask me About DHS", "Home birth"],
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
            Prediction
          </Typography>
          {step === 0 ? (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Was your last birth a caeserian session
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={last_birth_caesarean}
                  label="last_birth_caesarean"
                  onChange={(event) =>
                    setlast_birth_caesarean(event.target.value)
                  }
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>Unavailable</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Religion{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={religion}
                  label="Religion"
                  onChange={(event) => setReligion(event.target.value)}
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>Muslim</MenuItem>
                  <MenuItem value={1}>Christian</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                variant="outlined"
                placeholder="Number of living children "
                value={num_living_children}
                onChange={(e) => setnum_living_children(e.target.value)}
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
                enter number of living children
              </Typography>
              <TextField
                type="number"
                variant="outlined"
                placeholder="Number of antenatal visit "
                value={num_antenatal_visits}
                onChange={(e) => setnum_antenatal_visits(e.target.value)}
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
                enter number of antenatal visit
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Wanted Last Child{" "}
                </InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={wanted_last_child}
                  label="wanted_last_child"
                  onChange={(event) => setwanted_last_child(event.target.value)}
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>Then</MenuItem>
                  <MenuItem value={1}>Later</MenuItem>
                  <MenuItem value={2}>Not Anymore</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Are you a tradditional assistant for birth attendant{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={assistance_tba}
                  label="assistance_tba"
                  onChange={(event) => setassistance_tba(event.target.value)}
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>Yes</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Residing with partner{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={residing_with_partner}
                  label="residing_with_partner"
                  onChange={(event) =>
                    setresiding_with_partner(event.target.value)
                  }
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>Yes</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                  <MenuItem value={2}>None</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Fertility preference{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fertility_preference}
                  label="fertility_preference"
                  onChange={(event) =>
                    setfertility_preference(event.target.value)
                  }
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>have another</MenuItem>
                  <MenuItem value={1}>No more</MenuItem>
                  <MenuItem value={2}>
                    sterilized (respondent or partner)
                  </MenuItem>
                  <MenuItem value={3}>undecided</MenuItem>
                  <MenuItem value={4}>declared infecund</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  partner's education level{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={husband_education}
                  label="husband_education"
                  onChange={(event) => sethusband_education(event.target.value)}
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={1}>No education</MenuItem>
                  <MenuItem value={0}>primary</MenuItem>
                  <MenuItem value={2}>Higher </MenuItem>
                  <MenuItem value={3}>Secondary</MenuItem>
                  <MenuItem value={4}>Don't know</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Who decides on respondent's health care{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={health_care_decision}
                  label="health_care_decision"
                  onChange={(event) =>
                    sethealth_care_decision(event.target.value)
                  }
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>respondent and partner</MenuItem>
                  <MenuItem value={1}>partner alone</MenuItem>
                  <MenuItem value={2}>respondent alone </MenuItem>
                  <MenuItem value={4}>someone else</MenuItem>
                  <MenuItem value={3}>None</MenuItem>
                  <MenuItem value={5}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    fontSize: "13px", // Match input font size
                    "&.Mui-focused": {
                      color: "black", // Color when input is focused
                    },
                  }}
                >
                  Beating justified if wife goes out without telling husband{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={beating_justified_out}
                  label="beating_justified_out"
                  onChange={(event) =>
                    setbeating_justified_out(event.target.value)
                  }
                  sx={{
                    height: "45px", // Matches the overall height of the TextField
                    fontSize: "13px", // Text size matches the TextField
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e6237e", // Default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Hover border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff4081", // Focus border color
                    },
                    ".MuiSelect-select": {
                      padding: "7px", // Adjust padding like TextField input
                      height: "30px", // Matches input height inside the TextField
                    },
                  }}
                >
                  <MenuItem value={0}>Yes</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              disabled={step === 0}
              variant="outlined"
              sx={{
                borderColor: "#e6237e",
                color: "#e6237e",
                fontWeight: 600,
                marginTop: "10px",
                width: "40%",
              }}
              onClick={() => setStep(0)}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              style={{
                background: "#e6237e",
                fontWeight: 600,
                marginTop: "10px",
                width: "40%",
              }}
              onClick={() => (step === 0 ? setStep(1) : handlePredict())}
            >
              {step === 0 ? "Next" : "Predict"}
            </Button>
          </Box>
        </div>
      ) : null}
    </>
  );
}
