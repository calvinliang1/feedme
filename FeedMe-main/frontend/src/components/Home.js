import React, { useState, useEffect } from "react";
import { Table, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, TableBody, TableCell, Paper, TableContainer, Typography, Icon, TableRow, Grid, Tabs, Tab, CardActions, Button, TextField } from "@material-ui/core";
import { post, get } from "../services/feedMe"
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Receive from "./Receive";

const Home = () => {

    const [typeOf, setTypeOf] = useState('');
    const [restaurant, setRestaurant] = useState(null);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [img, setImg] = useState("");

    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState(0);
    const [newItemImgURL, setNewImgURL] = useState("");
    const [status, setStatus] = useState(false);
    const [requestsList, setRequestsList] = useState([]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddItem = async () => {
        let res = await post("/api/restaurants/addItem", localStorage.getItem('token'), {
            itemName: newItemName,
            quantity: newItemQuantity,
            imgURL: newItemImgURL,
        })
        res = await res.json();
        if (res.status == 200) {
            setRows(res.items)
            handleClose()
        }
    }

    const [rows, setRows] = useState([
    ])

    const getUser = async () => {
        let response = await get("/api/auth/", localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setTypeOf(response.accountType)
            if (response.accountType == "Donate") {
                setRestaurant(response.restaurant)
                setStatus(response.restaurant.open)
                let res = await get("/api/restaurants/getItems", localStorage.getItem('token'))
                res = await res.json();
                if (res.status == 200) {
                    setRows(res.items)
                }
                let resRequests = await get("/api/restaurants/getRequests", localStorage.getItem('token'))
                resRequests = await resRequests.json();
                if (resRequests.status == 200) {
                    setRequestsList(resRequests.requests)
                }
            }
        }
        else {
            localStorage.clear()
            navigate("/login")
        }
    };

    const editRestaurant = async () => {
        let response = await get("/api/restaurants/edit/", localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setStatus(!status)
        }
    };

    const incrementItem = async (itemID) => {
        let response = await get("/api/restaurants/incrementItem/" + itemID, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setRows(response.items)
        }
    };

    const decrementItem = async (itemID) => {
        let response = await get("/api/restaurants/decrementItem/" + itemID, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setRows(response.items)
        }
    };

    const acceptRequest = async (requestID) => {
        let response = await get("/api/restaurants/acceptRequest/" + requestID, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setRequestsList(response.requests)
        }
    };

    const deleteItem = async (itemID) => {
        let response = await get("/api/restaurants/deleteItem/" + itemID, localStorage.getItem('token'))
        response = await response.json()
        if (response.status == 200) {
            setRows(response.items)
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !== "undefined" && token !== null && token !== undefined) {
            getUser();
        }
    }, []);

    const submitRestaurant = async () => {
        let res = await post("/api/restaurants/registerRestaurant", localStorage.getItem('token'), {
            name: name,
            address: address,
            postalCode: postalCode,
            img: img
        })
        res = await res.json();
        if (res.status == 200) {
            setRestaurant(res)
        }
    }

    const Add = () => {
        handleOpen()
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


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
            {typeOf == "Donate" && (
                <section>
                    {restaurant == null && (
                        <div class="centered">
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                </Grid>
                                <Grid item xs={4}>
                                    <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>Please register your restaurant.</span>
                                    <br /><br />
                                </Grid>
                                <Grid item xs={4}>
                                </Grid>
                            </Grid>

                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>What's your restaurant's name?</span>
                                <br />
                                <TextField id="filled-basic" label="Enter Restaurant Name" variant="filled" style={{ width: "100%", maxWidth: "400px" }} onChange={(e) => setName(e.target.value)} />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>

                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <br />
                                <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>What's your restaurant's address?</span>
                                <br />
                                <TextField id="filled-basic" label="Enter Address" variant="filled" style={{ width: "100%", maxWidth: "400px" }} onChange={(e) => setAddress(e.target.value)} />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>

                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <br />
                                <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>What's your restaurant's Postal/Zip Code?</span>
                                <br />
                                <TextField id="filled-basic" label="Enter Postal/Zip Code" variant="filled" style={{ width: "100%", maxWidth: "400px" }} onChange={(e) => setPostalCode(e.target.value)} />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>

                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                                <br />
                                <span style={{ color: "black", fontFamily: "Helvetica", fontSize: "24px", fontWeight: "400" }}>Upload restaurant image?</span>
                                <br />
                                <TextField id="filled-basic" label="Enter restaurant image URL" variant="filled" style={{ width: "100%", maxWidth: "400px" }} onChange={(e) => setImg(e.target.value)} />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>

                            <br />
                            <div style={{ width: "400px" }} class="rightJustified">
                                <Button size="large" style={{ color: "white", fontFamily: "Helvetica", backgroundColor: "black", textTransform: "none" }} onClick={submitRestaurant}>Register Restaurant</Button>&nbsp;
                            </div>
                            <br />
                        </div>
                    )}
                    {restaurant != null && (
                        <div class="Menu">
                            <br />
                            <Grid container spacing={0}>
                                <Grid item xs={4}>

                                </Grid>
                                <Grid item xs={4}>
                                    <div class="defaultFont" style={{ textAlign: "left" }}>Menu</div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div class="defaultFont" style={{ textAlign: "left" }}> {status == false && (<div>Status: Closed<Button onClick={() => editRestaurant()}><EditIcon /></Button></div>)}
                                        {status == true && (<div>Status: Open<Button onClick={() => editRestaurant()}><EditIcon /></Button></div>)}</div>
                                </Grid>
                                <br /> <br /> <br /> <br />
                                <Grid item xs={3}>

                                </Grid>
                                <Grid item xs={6}>
                                    <div class="defaultFont" style={{ textAlign: "left" }}>Items <Button onClick={() => Add()}><AddIcon /></Button></div>
                                </Grid>
                                <Grid item xs={3}>

                                </Grid>

                                <br /> <br /> <br /> <br />
                                <Grid item xs={3}>

                                </Grid>
                                <Grid item xs={6}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            <img src={row.img} width="25%" height="25%"></img>
                                                        </TableCell>
                                                        <TableCell align="right">{row.itemName}</TableCell>
                                                        <TableCell align="right">{row.quantity}</TableCell>
                                                        <TableCell align="right"><Button onClick={() => incrementItem(row.itemID)}><AddIcon /></Button></TableCell>
                                                        <TableCell align="right"><Button onClick={() => decrementItem(row.itemID)}><RemoveIcon /></Button></TableCell>
                                                        <TableCell align="right"><Button onClick={() => deleteItem(row.itemID)}><DeleteIcon /></Button></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={3}>
                                </Grid>

                                <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
                                <Grid item xs={3}>

                                </Grid>
                                <Grid item xs={6}>
                                    <div class="defaultFont" style={{ textAlign: "left" }}>Requests</div>
                                </Grid>
                                <Grid item xs={3}>

                                </Grid>

                                <br /> <br /> <br /> <br />
                                <Grid item xs={3}>

                                </Grid>
                                <Grid item xs={6}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableBody>
                                                {requestsList.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.itemName}
                                                        </TableCell>
                                                        <TableCell align="left">{row.requestID}</TableCell>
                                                        <TableCell align="left">{row.quantity}</TableCell>
                                                        <TableCell align="left"><Button onClick={() => acceptRequest(row.requestID)}><Check /></Button></TableCell>
                                                        <TableCell align="left"><Button onClick={() => decrementItem(row.itemID)}><Close /></Button></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={3}>
                                </Grid>

                            </Grid>

                        </div>
                    )}
                </section>
            )}
            {typeOf == "Receive" && (
                <Receive />
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a new item to FeedMe, please enter your item name, quantity and an image URL here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Item Name"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Quantity"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Image URL"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewImgURL(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddItem}>Add Item</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

export default Home;