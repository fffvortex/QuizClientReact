import { Grid2 } from "@mui/material";
import React from "react";

export default function Center(props) {
    return(
        <Grid2 container direction='column' alignItems='center' sx={{minHeight:'100vh'}} >
            <Grid2 xs={1} >
                    {props.children}
            </Grid2>
        </Grid2>
    )
}