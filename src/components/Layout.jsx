import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useStateContext from "../hooks/useStateContext";

export default function Layout() {
    const {resetContext} = useStateContext()
    const navigate = useNavigate()
    const logout = () => {
        resetContext()
        navigate('/')
    }
  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ m: "auto" }}>
          <Typography variant="h4" align="center">
            Quiz App
          </Typography>
          <Button sx={{marginLeft:1}} onClick={logout} >
            logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
