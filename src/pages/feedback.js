import {
    CircularProgress,
    Grid,
    Typography,
    IconButton,
  } from "@material-ui/core";
  import React, { useEffect, useState } from "react";
  import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@material-ui/core/";
  import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
  import axios from "axios";
  import { Box } from "@mui/system";
  import { palette } from '@material-ui/system';
  
  
  export default function UserFeedbackPage() {
  
    const [revalidateUsersFeedbackData, setRevalidateUsersFeedbackData] = useState();
    return (
      <Box bgcolor="primary.main">
        <Paper>
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <Paper variant="outlined">
                  <Box p={2}>
                    <Typography variant="h6">User Feedback</Typography>
                  </Box>
                </Paper>
                <UsersFeedbackTable
                  revalidateData={revalidateUsersFeedbackData}
                  onDeleteButtonClicked={(data) => {
                    console.log("FEEDBACK TO BE DELETED", data);
  
                    axios
                      .delete("/feedback/" + data._id)
                      .then((responseData) => {
                        console.log(responseData, "Deleted");
                      })
                      .catch((err) => {
                        console.log("Error deleting", data);
                        console.log(err.message);
                      })
                      .finally(() => {
                        setRevalidateUsersFeedbackData((prevState) => !prevState);
                      });
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
    
  }
  
  const UsersFeedbackTable = ({
    onDeleteButtonClicked,
    revalidateData,
  }) => {
    const [usersFeedback, setUsersFeedback] = useState();
    useEffect(() => {
      fetchData();
    }, [revalidateData]);
    const fetchData = () => {
      axios
        .get("/feedback")
        .then((res) => {
          setUsersFeedback(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    if (!usersFeedback) {
      return (
        <Paper
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
          variant="outlined"
        >
          <CircularProgress color="primary" size={72} thickness={8} />
        </Paper>
      );
    }
    return (
      <Box mt={2}>
        <TableContainer
          component={(props) => <Paper variant="outlined" {...props} />}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Feedback</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {usersFeedback.map((data) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow>
                  <TableCell component="th" scope="row">
                    {data.name}
                  </TableCell>
                  <TableCell align="left">{data.email}</TableCell>
                  <TableCell align="left">{data.feedback}</TableCell>
                  <TableCell>
                    
                    <IconButton
                      onClick={() => {
                        onDeleteButtonClicked(data);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  
  