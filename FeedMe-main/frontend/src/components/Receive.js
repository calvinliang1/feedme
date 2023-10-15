import React, { useState, useEffect } from "react";
import { Table, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TableBody, TableCell, AppBar, Paper, Toolbar, MenuItem, Card, Box, Typography, Select, CardContent, CardMedia, Grid, Tabs, Tab, CardActions, Button, TextField } from "@material-ui/core";
import { post, get } from "../services/feedMe"
import { useLoginContext, LoginProvider } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Receive = () => {
    const navigate = useNavigate();
    const { authToken, setAuthToken } = useLoginContext();
    const [email, setEmail] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [address, setAddress] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantID, setRestaurantID] = useState([]);
    const [numStores, setNumStores] = useState(0);
    const [socket, setSocket] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [rows, setRows] = useState([])
    const [userID, setUserID] = useState("")
    const [socketReqID, setSocketReqID] = useState("")
    const [socketStatus, setSocketStatus] = useState("")
    const [requestedItems, setRequestedItems] = useState([])

    const handleOpen = async (id, address, postal) => {
        let response = await get("/api/customers/get/" + id, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setAddress(address)
            setPostalCode(postal)
            setRows(response.data)
            setRestaurantID(id)
        }
        setOpen(true);
    }

    const handleOpenAlert = async () => {
        setOpenAlert(true);
    }
    const handleClose = () => setOpen(false);
    const handleCloseAlert = () => setOpenAlert(false);

    const getRestaurants = async () => {
        let response = await get("/api/customers/getRestaurants/", localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setUserID(response.userID)
            setRestaurants(response.restaurants)
            setRequestedItems(response.requests)
            setNumStores(response.restaurants.length)
        }
    };

    const requestItem = async (itemID) => {
        let response = await get("/api/customers/makeRequest/" + restaurantID + "/" + itemID, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setRequestedItems(response.requests)
            handleClose()
        }
    };

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket', 'polling', 'flashsocket'] });
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !== "undefined" && token !== null && token !== undefined) {
            getRestaurants();
        }
    }, []);

    if (socket != null) {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('message', function (data) {
            if (data.restaurants){
                setRestaurants(data.restaurants)
                setNumStores(data.restaurants.length)
            }
            if (data.userID == userID)
            {
                handleOpenAlert()
                setRequestedItems(data.requests)
                setSocketReqID(data.requestID)
                setSocketStatus(data.status)
            }
        });
    }

    return (
        <div className="App">
            <div class="">
                <div style={{position: "relative", zIndex: "0", width:"100%", height: "1000px", backgroundSize: "cover", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundImage: "url(https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"}}>
                    <h1 style={{position: "absolute", color:"white", height: "50%", fontFamily: "Helvetica", fontSize: "100px", fontWeight: "400", textAlign: "Left", paddingLeft: "5%", paddingTop: "15%"}}><b>Solving Food Waste<br/>One Step at a Time</b></h1>
                </div>
                <br />
                <div style={{ textAlign: "Left", color: "black", fontFamily: "Helvetica", fontSize: "36px", fontWeight: "400", marginLeft: "40px" }}><b>Stores Available ({numStores})</b></div>

                <Grid>
                    <Grid container spacing={0}>
                        {restaurants.map((row) => (
                            <Grid item xs={4}>
                                <figure>
                                    <img src={row.img} alt={row.name} style={{ width: "100%", height: "300px", objectFit: "cover" }} onClick={() => handleOpen(row.userID, row.address, row.postalCode)} />
                                    <figcaption style={{ textAlign: "Left", color: "black", fontFamily: "Helvetica", fontSize: "28px", fontWeight: "400" }}><b>{row.name}</b></figcaption>
                                    <figcaption style={{ textAlign: "Left", color: "black", fontFamily: "Helvetica", fontSize: "18px", fontWeight: "400", marginTop: "5px", marginBottom: "30px" }}>{row.address} • {(Math.random() * 3).toFixed(2)} km</figcaption>
                                </figure>
                            </Grid>
                        ))}

                    </Grid>
                </Grid>
            
                <div style={{background: "rgb(246,246,246)", padding: "40px", minHeight: "100%", display: "flex", flexDirection: "column"}}>
                    <div style={{ textAlign: "Left", color: "black", fontFamily: "Helvetica", fontSize: "36px", fontWeight: "400", marginBottom: "35px" }}><b>Your Requests</b></div>
                    <Grid>
                        <Grid container spacing={0}>
                            <TableContainer component={Paper} >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Restaurant</b></TableCell>
                                            <TableCell align="left"><b>Item</b></TableCell>
                                            <TableCell align="left"><b>RequestID</b></TableCell>
                                            <TableCell align="left"><b>Status</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requestedItems.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.itemName}</TableCell>
                                                <TableCell align="left">{row.requestID}</TableCell>
                                                <TableCell align="left">{row.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Grid>
                    </Grid>
                </div>

            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle><b>Available Items</b></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div style={{ textAlign: "left", color: "black", fontFamily: "Helvetica", fontSize: "18px", fontWeight: "400" }}>Address: {address}, {postalCode}</div>
                        <TableContainer component={Paper} >
                            <Table aria-label="simple table">
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img src={row.img} width="100px" height="100px"></img>
                                            </TableCell>
                                            <TableCell align="right">{row.itemName}</TableCell>
                                            <TableCell align="right">{row.quantity}</TableCell>
                                            <TableCell align="right"><Button onClick={() => requestItem(row.itemID)}>Request</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>

                </DialogActions>
            </Dialog>


            <Dialog open={openAlert} onClose={handleCloseAlert}>
                <DialogTitle>Request Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div style={{ textAlign: "left", color: "black", fontFamily: "Segoe UI", fontSize: "18px", fontWeight: "400" }}><b>Address: {address}, {postalCode}</b></div>
                        <TableContainer component={Paper} >
                            <Table aria-label="simple table">
                                <TableBody>
                                    Your request of RequestID: {socketReqID} has been changed to {socketStatus}
                                    <br/>
                                    Please pick up your item at the corresponding location.
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>Close</Button>

                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Receive;