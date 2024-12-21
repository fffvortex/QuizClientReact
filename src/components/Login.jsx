import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect} from "react";
import Center from "./Center";
import useForm from "../hooks/useForm";
import { createAPIEndpoint, ENDPOINTS } from "../api";
import useStateContext from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";

const getFreshModelObject = () => ({
  name: "",
  email: "",
});

export default function Login() {

  const {context, setContext, resetContext} = useStateContext()
  const navigate = useNavigate()

  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModelObject);

  useEffect(() => {
    resetContext()
  }, [])
  

  const login = (e) => {
    e.preventDefault();
    if (validate()) {
      createAPIEndpoint(ENDPOINTS.participant)
      .post(values)
      .then(res => {
        setContext({participantId: res.data.participantId})
        navigate('/quiz')
      })
      .catch(err => console.log(err))
    }
  };

  const validate = () => {
    let temp = {};
    temp.email = /^\S+@\S+\.\S+$/.test(values.email)
      ? ""
      : "email is not valid";
    temp.name = values.name != "" ? "" : "this field is required";

    setErrors(temp);
    return Object.values(temp).every((x) => x == "");
  };

  return (
    <Center>
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ my: 3 }}>
            Quiz
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": {
                margin: 1,
                width: "90%",
              },
            }}
          >
            <form noValidate onSubmit={login}>
              <TextField
                value={values.email}
                onChange={handleInputChange}
                label="Email"
                name="email"
                variant="outlined"
                {...(errors.email && {error: true,helperText: errors.email})}
              />
              <TextField
                value={values.name}
                onChange={handleInputChange}
                label="Name"
                name="name"
                variant="outlined"
                {...(errors.name && {error: true,helperText: errors.name})}
              />
              <Button
                sx={{ width: "90%", m: 1 }}
                type="submit"
                size="large"
                variant="contained"
              >
                start
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
