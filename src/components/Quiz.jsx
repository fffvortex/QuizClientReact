import { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from "../api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { getFormatedTime } from "../helper";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [qns, setQsn] = useState([]);
  const [qnsIndex, setQnsIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const { context, setContext } = useStateContext();
  const navigate = useNavigate()

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, [1000]);
  };

  useEffect(() => {
    setContext({
      timeTaken: 0,
      selectOptions: []
    })
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

  const updateAnswer = (qnId, optionIndex) => {
    const temp = [...context.selectOptions];

    temp.push({ qnId: qnId, selected: optionIndex });
    if (qnsIndex < 4) {
      setContext({ selectOptions: [...temp] });
      setQnsIndex(qnsIndex + 1);
    } else {
      setContext({ selectOptions: [...temp], timeTaken });
      navigate('/result')
    }
  };

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
        {qns[qnsIndex].imageName != null ? <CardMedia sx={{width: 'auto', m: '10px auto' }} component="img" image={BASE_URL + 'images/' + qns[qnsIndex].imageName} /> : null}
        <Typography variant="h6">{qns[qnsIndex].questionInWords}</Typography>
        <List>
          {qns[qnsIndex].options.map((item, index) => (
            <ListItemButton
              onClick={() => updateAnswer(qns[qnsIndex].questionId, index)}
              key={index}
            >
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
