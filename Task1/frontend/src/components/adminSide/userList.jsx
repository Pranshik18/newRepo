import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Alert } from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const headers = ['Role', 'Name', 'Email', 'Password', 'Created By', 'LastModifiedBy', 'Stats', 'Delete'];

const TableComponent = () => {
  const [userData, setUserData] = useState([]);
  const [statdata, setStatData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handlemodalOpen = () => setOpen(true);
  const [statRange, setStatRange] = useState();
  const [statValue, setStatValue] = useState();
  const [statsData, setStatsData] = React.useState(
    JSON.parse(localStorage.getItem("statData") || "[]")
  );
  const [openUpdateModal , setOpenUpdateModal] = useState(false)
  const [show, setShow] = useState(false);
  const [createdBy, setCreatedBy] = useState("Admin");
  const [modifiedBy, setModifiedBy] = useState("Admin");

  const handleUpdatemodalClose = ()=> setOpenUpdateModal(false)
  const handleUpdatemodalOpen = ()=> setOpenUpdateModal(true)

  useEffect(() => {
    // Fetch data from local storage
    const storedData = JSON.parse(localStorage.getItem('statData')) || [];
    setStatData(storedData);
  }, []);

  const handleStatDelete = (index) => {
    // Remove data from the table and update local storage
    const updatedData = [...statdata];
    updatedData.splice(index, 1);
    setStatData(updatedData);
    localStorage.setItem('statData', JSON.stringify(updatedData));
  };

  const handlemodalClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios.get('http://localhost:3012/employee').then((res) => {
      setUserData(res.data)
    })
  }

  const handleDelete = (index) => {
    axios.delete(`http://localhost:3012/employee/${userData[index]._id}`)
      .then((res) => {
        getUser();
      })
  }

  const handleStat = (index, i) => {
    localStorage.setItem("index", index)
    navigate('/stats')
  }

  const handleUpdateStatSave = () => {
    const index = localStorage.getItem("adminStatIndex")
    const updated = {
      ...statdata[index],
      statValue : statValue,
      statRange: statRange,
      modifiedBy : modifiedBy,
    }
    statdata[index] = updated
    localStorage.setItem("statData" , JSON.stringify(statdata))
    handleUpdatemodalClose()
  }
  const handleStatsUpdate = (i) => {
    localStorage.setItem("adminStatIndex", i)
    setStatValue(statdata[i].statValue)
    setStatRange(statdata[i].statRange)
    handleUpdatemodalOpen()
  }

  function handleSave() {
    setStatsData((prev) => [
      ...prev,
      {
        statValue,
        statRange,
        createdBy,
        modifiedBy
      },
    ]);
    setStatRange("");
    setStatValue("");
    console.log(createdBy, modifiedBy);
    setShow(true)
    handlemodalClose();
  }
  useEffect(() => {
    localStorage.setItem("statData", JSON.stringify(statsData));
  }, [statsData]);
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, ...({ display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              DashBoard
            </Typography>
            <Button onClick={handlemodalOpen} variant='contained' style={{ margin: '15px' }}>Add Parameter</Button> <Divider />
            <Button onClick={() => navigate('/createUser')} variant='contained'>Create new User</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
        >
          <DrawerHeader>
            <IconButton>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Divider />
        </Drawer>
        <Main>
          <DrawerHeader />
          <Typography variant='h4'>Employee List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : userData
                ).map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.emp_role}</TableCell>
                    <TableCell>{entry.emp_name}</TableCell>
                    <TableCell>{entry.emp_email}</TableCell>
                    <TableCell>{entry.emp_pass}</TableCell>
                    <TableCell>{entry.createdBy}</TableCell>
                    <TableCell>{entry.modifiedBy}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleStat(entry._id)}>
                        Stats
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Divider />
          <Typography variant='h4'>Parameter List</Typography>
      <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                    <TableCell>Parameter</TableCell>
                    <TableCell>Max Value</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Last Modified By</TableCell>
                    <TableCell>Delete</TableCell>
                    <TableCell>Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? statdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : statdata
                ).map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.statValue}</TableCell>
                    <TableCell>{entry.statRange}</TableCell>
                    <TableCell>{entry.createdBy}</TableCell>
                    <TableCell>{entry.modifiedBy}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleStatDelete(index)}>
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant='contained' color='primary' onClick={()=> handleStatsUpdate(index)}>Update</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Main>
      </Box>
      <Divider />
     
      <Modal
        open={open}
        onClose={handlemodalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant='h4'>Add Stats</Typography>
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            label="type of Stat"
            onChange={(e) => {
              setStatValue(e.target.value);
            }}
            value={statValue}
            variant="outlined"
          />
          <br />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="number"
            label="Max range of Stat"
            value={statRange}
            onChange={(e) => {
              setStatRange(e.target.value);
            }}
            variant="outlined"
          />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save stat
          </Button>
        </Box>
      </Modal>
      {
        show ? <Alert severity='success'>Stat Added Successfully</Alert> : ''
      }

<Modal
        open={openUpdateModal}
        onClose={handleUpdatemodalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant='h4'>Update Stats</Typography>
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            label="type of Stat"
            onChange={(e) => {
              setStatValue(e.target.value);
            }}
            value={statValue}
            variant="outlined"
          />
          <br />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="number"
            label="Max range of Stat"
            value={statRange}
            onChange={(e) => {
              setStatRange(e.target.value);
            }}
            variant="outlined"
          />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateStatSave}
          >
            Save stat
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TableComponent;