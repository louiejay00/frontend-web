import {
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useEffect,  useState } from "react";
import {
  Paper,
} from "@material-ui/core/";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import axios from "axios";
import { Box } from "@mui/system";
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
// import DeleteIcon from '@mui/icons-material/Delete';


export default function ConfigurationsPage() {
  const handleBackup = () =>{   
    console.log("clicked");  
    axios
    .get("/admin/databasebackup", {
    })
    .then((res) => {
      console.log("res", res);
      console.log("res", res.data);
    })
    .catch((err) => {
      console.error("error in log Creation", err);
    })

  };  

const handleRestore = () =>{
  console.log("handleRestore clicked");
  axios
  .get("/admin/databaserestore", {
  })
  .then((res) => {
    console.log("res", res);
    console.log("res", res.data);
  })
  .catch((err) => {
    console.error("error in log Creation", err);
  })
}

const [revalidateReportsData, setRevalidateReportsData] = useState();

  return (
    <Box>
    <Button
      onClick= {handleBackup}
          variant="contained"  
          style={{
            left: "75%",
            borderRadius: 15,
            backgroundColor: "#fff",
            marginRight:"10px",
            zIndex:100
          }}
        >
          <Typography
            className="butt"
            style={{
              fontWeight: 400,
            }}
            variant="body1"
          >
           DB Backup
          </Typography>
        </Button>
        <Button
      onClick= {handleRestore}
          variant="contained"
          style={{
            left: "75%",
            borderRadius: 15,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            className="butt"
            style={{
              fontWeight: 400,
            }}
            variant="body1"
          >
            Restore Backup
          </Typography>
        </Button>
   
<Paper>
<Box p={2}>
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Paper variant="outlined">
          <Box p={2}>
            <Typography variant="h6">Reports</Typography>
          </Box>
        </Paper>
        <TransportationReportsTable
         revalidateData={revalidateReportsData}
          onDeleteButtonClicked={(data) => {
            console.log("REPORT TO BE DELETED", data);

            axios
              .delete("/process/" + data._id)
              .then((responseData) => {
                console.log(responseData, "Deleted");
              })
              .catch((err) => {
                console.log("Error deleting", data);
                console.log(err.message);
              })
              .finally(() => {
                setRevalidateReportsData((prevState) => !prevState);
              });
          }}S
        />
      </Grid>
    </Grid>
  </Box>
</Paper>
</Box>
);
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const TransportationReportsTable = ({
  onDeleteButtonClicked,
  revalidateData,
}) => {
  const [reports, setReports] = useState([]);

  const [driverTable, setDriverTable] = useState([])
  const [userTable, setUserTable] = useState([])

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/process")
      .then((res) => {
        setReports(res.data.map(obj => {
          const newObj = {...obj, id: obj._id}
          return newObj
        }))

        setDriverTable(res.data.map(obj => {
          const newObj = {...obj, id: obj._id}
          return newObj
        }).reduce((acc, val) => {
          const { driverName, NoOfPassengers, status } = val;
          const ind = acc.findIndex(el => el.driverName === driverName);
          if(ind !== -1){
             acc[ind].NoOfPassengers += NoOfPassengers;
             acc[ind].rejected += getIntegerStatus('rejected', status);
             acc[ind].cancelled += getIntegerStatus('cancelled', status);
             acc[ind].completed += getIntegerStatus('complete', status)      
          }else{
             acc.push({
               ...val,
               rejected: getIntegerStatus('rejected', status),
               cancelled: getIntegerStatus('cancelled', status),
               completed: getIntegerStatus('complete', status)
             });
          }
          return acc;
       }, []))

      setUserTable(res.data.map(obj => {
        const newObj = {...obj, id: obj._id}
        return newObj
      }).reduce((acc, val) => {
        const { passengerName, status } = val;
        const ind = acc.findIndex(el => el.passengerName === passengerName);
        if(ind !== -1){
           acc[ind].rejected += getIntegerStatus('rejected', status);
           acc[ind].cancelled += getIntegerStatus('cancelled', status);
           acc[ind].completed += getIntegerStatus('complete', status)      
        }else{
           acc.push({
             ...val,
             rejected: getIntegerStatus('rejected', status),
             cancelled: getIntegerStatus('cancelled', status),
             completed: getIntegerStatus('complete', status)
           });
        }
        return acc;
     }, []))

      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteUser = React.useCallback(
    (data) => () => {
      onDeleteButtonClicked(data);
    },
    [onDeleteButtonClicked],
  );

  const getIntegerStatus = (status, rowStatus) => {
    if(status === rowStatus.toLocaleLowerCase()){
      return 1
    }

    return 0
  }

 const userColumns = [
  { field: 'passengerName', headerName: 'Passenger Name', width: 150 },
  { field: 'passengerEmail', headerName: 'Passenger Email', width: 400 },
  { field: 'cpnum', headerName: 'Phone Number', width: 150 },
  { field: 'rejected', headerName: 'Rejected', width: 150 },
  { field: 'cancelled', headerName: 'Cancelled', width: 150 },
  { field: 'completed', headerName: 'Completed', width: 150 },
  { field: 'Sum', headerName: 'All', width: 150, renderCell: (params) => (params.row.rejected + params.row.cancelled + params.row.completed) },
  {
    field: 'actions',
    type: 'actions',
    width: 80,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteForeverIcon />}
        label="Delete"
        onClick={deleteUser(params.row)}
      />,
    ],
  }
]

const driverColumns = [
  { field: 'driverName', headerName: 'Driver Name', width: 150 },
  { field: 'NoOfPassengers', headerName: 'Number of Passengers', width: 150 },
  { field: 'rejected', headerName: 'Rejected', width: 150 },
  { field: 'cancelled', headerName: 'Cancelled', width: 150 },
  { field: 'completed', headerName: 'Completed', width: 150 },
  { field: 'Sum', headerName: 'All', width: 150, renderCell: (params) => (params.row.rejected + params.row.cancelled + params.row.completed) },
  {
    field: 'actions',
    type: 'actions',
    width: 80,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteForeverIcon />}
        label="Delete"
        onClick={deleteUser(params.row)}
      />,
    ],
  }
]


  if (!reports) {
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
    <Box>
    <Box mt={2} sx={{ height: '35vh', width: '100%' }}>
      <DataGrid  components={{
          Toolbar: CustomToolbar,
        }} rows={driverTable} columns={driverColumns} />
    </Box>

    <Box mt={2} sx={{ height: '35vh', width: '100%' }}>
      <DataGrid  components={{
          Toolbar: CustomToolbar,
        }} rows={userTable} columns={userColumns} />
    </Box>
    </Box>
   
  );
};
