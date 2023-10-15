import React, { useState } from "react";
import { AppBar, Paper, Toolbar, MenuItem, Card, Box, Typography, Select, CardContent, CardMedia, Grid, Tabs, Tab, CardActions, Button, TextField } from "@material-ui/core";
import { post, get } from "../services/feedMe"
import { useLoginContext, LoginProvider } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const { authToken, setAuthToken } = useLoginContext();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    const submitLogin = async () => {
        let res = await post("/api/auth/login", null, {
            email: email,
            password: pw,
        })
        res = await res.json();
        if (res.status == 200) {
            localStorage.setItem('token', res.sessionToken);
            setAuthToken(res.sessionToken);
            window.location = "/"
        }
    }

    return (
        <div className="App">
            <div style={{ background: "black" }}>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <br />
                        <span style={{ color: "white", fontFamily: "Oswald", fontSize: "33px" }}>&nbsp;Feed<span style={{ color: "#3FC060" }}>Me</span></span>
                    </Grid>
                </Grid>
                <br />
            </div>
            <div class="centered">
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                        <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>What's your email address?</span>
                        <br />
                        <TextField id="filled-basic" label="Enter Email Address" variant="filled" style={{ width: "100%", maxWidth: "400px" }} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                        <br />
                        <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>What's your password?</span>
                        <br />
                        <TextField id="filled-basic" label="Enter Password" variant="filled" style={{ width: "100%", maxWidth: "400px" }} type="password" onChange={(e) => setPw(e.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>

                </Grid>
                <br />
                <div style={{ width: "400px" }} class="rightJustified">
                    <Button size="large" style={{ color: "white", fontFamily: "Helvetica", backgroundColor: "black", textTransform: "none" }} onClick={submitLogin}>Login</Button>&nbsp;
                </div>
                <br />
                <div style={{ width: "400px" }} class="rightJustified">
                    <span style={{ color: "#6B6B6B", fontFamily: "Helvetica", fontSize: "12px", fontWeight: "400" }}><a href="/register">Click here to Sign Up.</a></span>
                </div>
            </div>
        </div>
    )
}

export default SignUp;