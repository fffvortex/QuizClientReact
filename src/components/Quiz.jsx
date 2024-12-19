import { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { getFormatedTime } from "../helper";

export default function Quiz() {
  const [qns, setQsn] = useState([]);
  const [qnsIndex, setQnsIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, [1000]);
  };

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => {
        setQsn(res.data);
        startTimer();
      })
      .catch((err) => console.log(err));

    return () => {
      clearInterval(timer);
    };
  }, []);

  return qns.length != 0 ? (
    <Card
      sx={{
        maxWidth: "40rem",
        mx: "auto",
        mt: "5",
        "& .MuiCardHeader-action": { m: 0, alignSelf: "center" },
      }}
    >
      <CardContent>
        <CardHeader
          title={"Вопрос " + (qnsIndex + 1) + " из 5"}
          action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
        ></CardHeader>
        <Box>
          <LinearProgress
            variant="determinate"
            value={((qnsIndex + 1) * 100) / 5}
          />
        </Box>
        <Typography variant="h6">{qns[qnsIndex].questionInWords}</Typography>
        <List>
          {qns[qnsIndex].options.map((item, index) => (
            <ListItemButton key={index}>
              <div>
                <b>{String.fromCharCode(65 + index) + " . "}</b>
                {item}
              </div>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  ) : null;
}
