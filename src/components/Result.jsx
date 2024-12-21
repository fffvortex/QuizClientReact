import React, { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { ENDPOINTS, createAPIEndpoint } from "../api";
import { getFormatedTime } from "../helper";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { green, yellow, red } from "@mui/material/colors";

export default function Result() {
  const { context, setContext } = useStateContext();
  const [score, setScore] = useState(0);
  const [qnAnswers, setQnAnswers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = context.selectOptions.map((x) => x.qnId);
    createAPIEndpoint(ENDPOINTS.getAnswers)
      .post(ids)
      .then((res) => {
        const qna = context.selectOptions.map((x) => ({
          ...x,
          ...res.data.find((y) => y.QuestionId === x.QuestionId),
        }));
        setQnAnswers(qna);
        calculateScore(qna);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateScore = (qna) => {
    let tempScore = qna.reduce((acc, curr) => {
      return curr.answer === curr.selected ? acc + 1 : acc;
    }, 0);
    setScore(tempScore);
  };

  const restart = () => {
    setContext({
      timeTaken: 0,
      selectOptions: [],
    });
    navigate("/quiz");
  };

  const submitScore = () => {
    createAPIEndpoint(ENDPOINTS.participant)
      .put(context.participantId, {
        participantId: context.participantId,
        score: score,
        timeTaken: context.timeTaken,
      })
      .then((res) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const colorizeScore = (score) => {
    if (score <= 3) {
      return red[600];
    } else if (score === 4) {
      return yellow[600];
    } else {
      return green[600];
    }
  };

  return (
    <>
      <Card sx={{ mt: 5, display: "flex", width: "80%", mx: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", textAlign: "center" }}>
            <Typography variant="h4">Результаты</Typography>
            <Typography variant="h6">Счет</Typography>
            <Typography
              sx={{ fontWeight: "600" }}
              color={colorizeScore(score)}
              variant="span"
            >
              {" "}
              {score}
            </Typography>{" "}
            / 5
            <Typography>
              Время: {getFormatedTime(context.timeTaken)}{" "}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-around", m: 3 }}>
              <Button sx={{marginInline:1}} variant="contained" size="small" onClick={restart}>
                restart
              </Button>
              <Button variant="contained" size="small" onClick={submitScore}>
                submit
              </Button>
            </Box>
            <Alert
              sx={{
                visibility: showAlert ? "visible" : "hidden",
                width: "60%",
                m: "auto",
              }}
              variant="string"
              severity="success"
            >
              Счет сохранен
            </Alert>
          </CardContent>
        </Box>
        {score === 5 ? (
          <CardMedia
            component="img"
            image="./5.5.gif"
            sx={{ width: "16rem", m: 1 }}
            className="imgCard"
          />
        ) : (
          <CardMedia
            component="img"
            image="./1.5.gif"
            sx={{ width: "16rem", m: 1 }}
          />
        )}
      </Card>
    </>
  );
}
