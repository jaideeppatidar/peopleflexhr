import React, { useState, useEffect } from "react";
import "./PersonalInfo.css";
import { deleteEmployee, fetchEmployeeById } from "../../../../ApiServices";
import { useParams } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Typography, Grid, TextField, Button, FormControlLabel, Checkbox, Collapse, MenuItem, Select, FormControl, TextareaAutosize, InputLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import EmptyFolderIcon from '../../../../../components/assets/Icons/empty-folder.png';
import DynamicButton from "../../../../../components/DynamicButton/DynamicButton";
import LinearIndeterminate from "../../../../../components/Linearindeterminate/Linearindeterminate";
import ConfirmationModal from "../../../../../components/ConfirmationModal/ConfirmationModal";
import { ToastContainer } from "react-toastify";

function PersonalInformation() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMedicalOpen, setIsMedicalOpen] = useState(false);
    const [isPersonalOpen, setIsPersonalOpen] = useState(false);
    const [isContractAndAnnualLeaveInformation, setIsContractAndAnnualLeaveInformation] = useState(false);
    const [isEmploymentSummary, setIsEmploymentSummary] = useState(false);
    const [isRoleInformation, setIsRoleInformation] = useState(false)
    const [isSalaryInformation, setIsSalaryInformation] = useState(false)
    const [isPayrollInformation, setIsPayrollInformation] = useState(false)
    const [isBankDetail, setIsBankDetail] = useState(false)
    const [isNotes, setIsNotes] = useState(false)
    const [isSensitiveDetail, setIsSensitiveDetail] = useState(false)
    const [isTermination, setIsTermination] = useState(false)
    const [isDeleteEmployeeRecord, setIsDeleteEmployeeRecord] = useState(false)
    const [checkedA, setCheckedA] = React.useState(false);
    const [checkedB, setCheckedB] = React.useState(false);
    const [date, setDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [notes, setNotes] = useState('');
    const [rightToWork, setRightToWork] = useState('');
    const [exitInterview, setExitInterview] = useState(false);
    const [reEngagement, setReEngagement] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const { id } = useParams(); 
    const [employeeData, setEmployeeData] = useState([]);
    const [viewOption, setViewOption] = useState('');
    const [activeTab, setActiveTab] = useState("Absence");
    const [showForm, setShowForm] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [accordionOpen, setAccordionOpen] = useState({
        currentFuture: false,
        history: false,
        cancelled: false,
    });
 
  
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            console.log('Files uploaded:', acceptedFiles); 
        },
        multiple: true,
        accept: '.jpg,.jpeg,.png,.pdf,.docx', 
    });
    const currentYear = new Date().getFullYear();
    const options = [10, 20, 30, 40, 50];

    const loadEmployeeData = async () => {
       
        try {
            const data = await fetchEmployeeById(id);
            setEmployeeData(data);
        } catch (error) {
            console.error("Error loading employee data:", error);
        } 
    };

    useEffect(() => {
        if (id) {
            loadEmployeeData();
        }
    }, [id]);


    

    if (!employeeData) {
        return <div>
            <LinearIndeterminate />
        </div>;
    }

    // Get initials for profile photo
    const getInitials = (name) => {
        if (!name) return "";
        const nameParts = name.split(" ");
        return `${nameParts[0]?.charAt(0) || ""}${nameParts[1]?.charAt(0) || ""}`;
    };





    const toggleAccordion = (section) => {
        setAccordionOpen((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

   

    const OvertimeSection = ({ title, items, btnText }) => (
        <div className="section">
            <div className="OverTimeTitle">{title}</div>
            <div className="overtime-details">
                {items.map((item, index) => (
                    <div key={index}>
                        <div>{item.label}</div>
                        <div>{item.time}</div>
                        <div>{item.description}</div>
                    </div>
                ))}
            </div>
            <div>
                {btnText && <button className="use-toil-btn">{btnText}</button>}
            </div>
        </div>
    );

    const AccordionItem = ({ title, isOpen, onClick }) => (
        <div className="accordion-item">
            <button onClick={onClick} className="accordion-button">
                {title}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </button>
            {isOpen && <div className="accordion-content">No data</div>}
        </div>
    );

    const handleDelete = async (id) => {
        try {
            await deleteEmployee(id); // Deleting the employee data
            await loadEmployeeData(); // Reload employee data after deletion
            setEmployeeData((prevDocuments) => {
                // Ensure prevDocuments is an array before calling .filter()
                if (Array.isArray(prevDocuments)) {
                    return prevDocuments.filter((employee) => employee.id !== id);
                } else {
                    // If it's not an array, log and return the previous state or an empty array
                    console.error('prevDocuments is not an array:', prevDocuments);
                    return []; // Or return prevDocuments if you want to keep it unchanged
                }
            });
        } catch (error) {
            toast.error("Failed to delete employee");
        }
    };
    
    

    const handleCloseConfirmationModal = () => {
        setDocumentToDelete(null);
        setShowConfirmationModal(false);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            handleDelete(documentToDelete);
            handleCloseConfirmationModal();
        }
    };

    const handleOpenConfirmationModal = (id) => {
        setDocumentToDelete(id);
        setShowConfirmationModal(true);
    };


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleMedicalInfo = () => {
        setIsMedicalOpen(!isMedicalOpen);
    };

    const togglePersonalInfo = () => {
        setIsPersonalOpen(!isPersonalOpen)
    };

    const toggleContractAndAnnualLeaveInformation = () => {
        setIsContractAndAnnualLeaveInformation(!isContractAndAnnualLeaveInformation);
    }

    const toggleEmploymentSummary = () => {
        setIsEmploymentSummary(!isEmploymentSummary);
    }

    const toggleRoleInformation = () => {
        setIsRoleInformation(!isRoleInformation);
    }

    const toggleSalaryInformation = () => {
        setIsSalaryInformation(!isSalaryInformation);
    }

    const togglePayrollInformation = () => {
        setIsPayrollInformation(!isPayrollInformation);
    }

    const toggleBankDetail = () => {
        setIsBankDetail(!isBankDetail);
    }

    const toggleNotes = () => {
        setIsNotes(!isNotes)
    }

    const toggleSensitiveDetail = () => {
        setIsSensitiveDetail(!isSensitiveDetail);
    }

    const toggleTermination = () => {
        setIsTermination(!isTermination);
    }

    const toggleDeleteEmployeeRecord = () => {
        setIsDeleteEmployeeRecord(!isDeleteEmployeeRecord)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleViewOptionChange = (e) => setViewOption(e.target.value);



    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     if (name in contractData) {
    //         setContractData({
    //             ...contractData,
    //             [name]: value
    //         });
    //     } else if (name in roleData) {
    //         setRoleData({
    //             ...roleData,
    //             [name]: value
    //         });
    //     }
    // };



    const handleChangeA = (event) => {
        setCheckedA(event.target.checked);
    };

    const handleChangeB = (event) => {
        setCheckedB(event.target.checked);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleChange = (event) => {
        setRightToWork(event.target.value);
    };

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const handleExitInterviewChange = (event) => {
        setExitInterview(event.target.checked);
    };

    const handleReEngagementChange = (event) => {
        setReEngagement(event.target.checked);
    };

    const handleButtonClick = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="container">
            <div className="profile-card">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-photo">
                        {employeeData.image ? (
                            <img
                            src={`${process.env.REACT_APP_API_IMAGE}/${employeeData.image}`}
                                alt={employeeData.employeeName}
                                style={{
                                    width: "90%",
                                    height: "90%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                        ) : (
                            getInitials(employeeData.employeeName)
                        )}
                    </div>
                    <div className="NameContainer">
                        <div className="EmployeeNameContainer">
                            <div className="EmployeeName"> Name : {employeeData.employeeName}</div>
                            <div className="EmployeeDegination">
                            Designation: { employeeData.designation}
                            </div>
                        </div>
                        <div className="EmplyeeRegisterEmailDetails">
                            <div >
                                <div className="EmployeeEmail" style={{ color: 'blue',cursor:'pointer'  }}> <span style={{ color: 'black' }}>Email : </span>{employeeData.email}</div>
                                <div style={{ color: 'blue',cursor:'pointer' }} className="EmployeeNumber"> <span style={{ color: 'black' }}>Mobile No : </span> {employeeData.mobile}</div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    {[
                        "Absence",
                        "Employment",
                        "Overtime",
                        "Personal",
                        "Emergencies",
                        "Documents",
                    ].map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? "tab-btn active-tab" : "tab-btn"}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === "Absence" && (
                        <div className="absence-section">
                            <div className="HeaderPersonalDetails">
                                <div>
                                    <label className="block font-semibold text-sm mb-3">
                                        Filter absences
                                    </label>
                                    <div className="flex gap-4">
                                        <FormControl variant="outlined" sx={{ width: '220px', backgroundColor: 'white' }}>
                                            <InputLabel>Absence Type</InputLabel>
                                            <Select defaultValue="" label="Absence Type">
                                                <MenuItem value="all">All absences</MenuItem>
                                                <MenuItem value="annual-leave">Annual leave</MenuItem>
                                                <MenuItem value="lateness">Lateness</MenuItem>
                                                <MenuItem value="sickness">Sickness</MenuItem>
                                                <MenuItem value="furlough">Furlough</MenuItem>
                                                <MenuItem value="others">Others</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm mb-4">
                                        Leave year
                                    </label>
                                    <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
                                        <InputLabel>Leave Year</InputLabel>
                                        <Select
                                            defaultValue={currentYear - 1}
                                            label="Leave Year"
                                        >
                                            {[...Array(5)].map((_, index) => {
                                                const year = currentYear - 1 + index;
                                                return (
                                                    <MenuItem key={year} value={year}>
                                                        {`01 Jan ${year} – 31 Dec ${year}`}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="absence-header-container">
                                <h1>All absences</h1>
                            </div>
                            <Box sx={{ padding: 1 }} className="absence-footer-container">
                                <Grid className="absence-three-container" container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', height: 'auto' }}>
                                            <Typography variant="body1" fontWeight="bold">Annual leave to take</Typography>
                                            <Typography variant="h4">20 / 28</Typography>
                                            <DynamicButton
                                                text="ADD ANNUAL LEAVE"
                                                height="40px"
                                                width="auto"
                                                color="white"
                                                backgroundColor="#6674a9" 
                                                display="flex"
                                                justifyContent="center"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', height: 'auto' }}>
                                            <Typography variant="body1">Sickness</Typography>
                                            <Typography variant="h4" component="span">0</Typography>
                                            <DynamicButton
                                                text="ADD"
                                                height="40px"
                                                width="auto"
                                                color="white"
                                                backgroundColor="#6674a9" 
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', height: 'auto' }}>
                                            <Typography variant="body1">Lateness</Typography>
                                            <Typography variant="h4" component="span">0</Typography>
                                            <DynamicButton
                                                text="LIST"
                                                height="40px"
                                                width="auto"
                                                color="white"
                                                backgroundColor="#6674a9" 
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    )}





                    {activeTab === 'Employment' && (
                        <div className="main-employment-container">
                            <div className="employment-container">
                              
                                <Box sx={{ padding: 2 }}>
                                    
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            padding: '10px 0',
                                            borderBottom: '2px solid lightblue',
                                        }}
                                        onClick={toggleContractAndAnnualLeaveInformation}
                                    >
                                        <Typography variant="h6" >Contract and annual leave information</Typography>
                                        <Typography variant="h6" sx={{ fontSize: '24px' }}>
                                            {isContractAndAnnualLeaveInformation ? <ExpandLess /> : <ExpandMore />}
                                        </Typography>
                                    </Box>

                                    {/* Collapsible content */}
                                    <Collapse in={isContractAndAnnualLeaveInformation}>
                                        <Box sx={{ padding: 2 }}>
                                            <Button variant="outlined" color="primary" sx={{ marginBottom: 2 }}>
                                                Edit
                                            </Button>

                                            {/* Employment Info Grid */}
                                            <Grid container spacing={2}>
                                                {[
                                                    { label: 'Entitlement unit in', value: 'Days' },
                                                    { label: 'Annual leave balance', value: '28 days' },
                                                    { label: 'Place of work', value: 'Working location not set' },
                                                    { label: '', value: 'Public holidays for England & Wales' },
                                                    { label: 'Mobile phone', value: 'Not specified' },
                                                ].map((item, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.label}</Typography>
                                                            <Typography variant="body2">{item.value}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            {/* Employment Contract Summary */}
                                            <TableContainer>
                                                <Table sx={{ marginTop: 2 }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>
                                                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                                    Contract summary
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {[
                                                            { label: 'Employment type', value: 'Fixed' },
                                                            { label: 'Entitlement unit', value: 'Days' },
                                                            { label: 'Contract start date', value: '01 Jan 2024' },
                                                            { label: 'Working time pattern', value: 'Mon-Fri 9-5' },
                                                            { label: 'Contracted hours per week', value: '35 hrs' },
                                                            { label: 'Annual leave year start', value: '01 January' },
                                                            { label: 'Min. leave entitlement', value: '28 days' },
                                                        ].map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{item.label}</TableCell>
                                                                <TableCell>{item.value}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            {/* Employment Place Work */}
                                            <TableContainer>
                                                <Table sx={{ marginTop: 2 }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>
                                                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                                    Place of work
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {[
                                                            { label: 'Working location', value: 'Not set' },
                                                            { label: 'Public holiday for', value: 'India' },
                                                        ].map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{item.label}</TableCell>
                                                                <TableCell>{item.value}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Collapse>
                                </Box>


                                <Box sx={{ padding: 2 }}>
                                    {/* Employment Summary Header */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            paddingBottom: 1,
                                            borderBottom: '2px solid lightblue',
                                        }}
                                        onClick={toggleEmploymentSummary}
                                    >
                                        <Typography variant="h6">Employment summary</Typography>
                                        <IconButton>
                                            {isEmploymentSummary ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Box>

                                    {/* Collapsible Content */}
                                    <Collapse in={isEmploymentSummary}>
                                        <Box sx={{ paddingTop: 2 }}>
                                            {/* Employment Info Grid */}
                                            <Grid container spacing={2}>
                                                {/* Employee Start Date */}
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            Employee Start Date
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            01 Jan 2024
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                {/* Length of Service */}
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            Length of Service
                                                        </Typography>
                                                        <Typography variant="body2">1 year 9 months</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>


                                    </Collapse>
                                </Box>
                            </div>



                            <div className="employment-container">
                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Role Information Accordion */}
                                    <Accordion expanded={isRoleInformation} onChange={toggleRoleInformation}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="role-information-content"
                                            id="role-information-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Role Information</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/* Employment Information Grid */}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Job Title
                                                        </Typography>
                                                        <Typography variant="body2">Director</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Contract Type
                                                        </Typography>
                                                        <Typography variant="body2">Full-time</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Team(s)
                                                        </Typography>
                                                        <Typography variant="body2">xyz</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Report
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Nagarjun Danda</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Probation end date
                                                        </Typography>
                                                        <Typography variant="body2">

                                                            Wednesday, 6th November 2024</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Notice required during probation period
                                                        </Typography>
                                                        <Typography variant="body2">Not specified</Typography>
                                                    </Box>
                                                </Grid>


                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Probation Required
                                                        </Typography>
                                                        <Typography variant="body2">No</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Notice Period
                                                        </Typography>
                                                        <Typography variant="body2">*</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                        </AccordionDetails>
                                    </Accordion>
                                </Box>


                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Salary Information Accordion */}
                                    <Accordion expanded={isSalaryInformation} onChange={toggleSalaryInformation}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="salary-information-content"
                                            id="salary-information-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Salary Information</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/* Employment Information Grid */}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Amount/Rate
                                                        </Typography>
                                                        <Typography variant="body2">Not specified</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Hourly Rate
                                                        </Typography>
                                                        <Typography variant="body2">Not specified</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Payment Frequency
                                                        </Typography>
                                                        <Typography variant="body2">Not specified</Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1" sx={{ color: 'black' }}>
                                                            Effective Date
                                                        </Typography>
                                                        <Typography variant="body2">Not specified</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>


                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Payroll Information Accordion */}
                                    <Accordion expanded={isPayrollInformation} onChange={togglePayrollInformation}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="payroll-information-content"
                                            id="payroll-information-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Payroll Information</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ padding: 0 }}>
                                                <span>Payroll number and pension details</span>
                                                {/* Payroll Number Input */}
                                                <Box sx={{ paddingTop: 2 }}>
                                                    {/* Payroll Number Input with Label */}
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={10} sm={3}>
                                                            {/* Label for Payroll Number */}
                                                            <Typography variant="body1" sx={{ color: 'black' }}>
                                                                Payroll Number
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={12} sm={9}>
                                                            {/* Input Field for Payroll Number */}
                                                            <TextField
                                                                label="Enter Payroll Number"
                                                                variant="outlined"
                                                                fullWidth
                                                                type="number"
                                                                sx={{ backgroundColor: 'white' }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                {/* Pension Heading */}
                                                <Box sx={{ marginTop: 3 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        Pension
                                                    </Typography>
                                                </Box>

                                                {/* Pension Eligibility Section */}
                                                <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                                                    <Typography variant="body1">Pension eligible?</Typography>
                                                    <DynamicButton
                                                        text="Yes"
                                                        height="40px"
                                                        width="70px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="No"
                                                        height="40px"
                                                        width="70px"
                                                        color="white"
                                                        backgroundColor="#ff0000bf" // Optional background color

                                                    />
                                                </Box>

                                                {/* Save and Cancel Buttons */}
                                                <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
                                                    <DynamicButton
                                                        text="Save"
                                                        height="40px"
                                                        width="85px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="Cancel"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                                    />
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>


                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Bank Details Accordion */}
                                    <Accordion expanded={isBankDetail} onChange={toggleBankDetail}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="bank-details-content"
                                            id="bank-details-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Bank Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ padding: 2 }}>
                                                {/* Name of Account */}
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Name of account"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter account name Max 60 chars"
                                                            value={employeeData?.bankDetails?.nameOnAccount || ''}
                                                        />
                                                    </Grid>

                                                    {/* Name of Bank */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Name of bank"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter bank name Max 60 chars"
                                                            value={employeeData?.bankDetails?.nameOfBank || []}
                                                        />
                                                    </Grid>

                                                    {/* Bank Branch */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Bank branch"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter bank branch"
                                                            value={employeeData?.bankDetails?.bankBranch || []}
                                                        />
                                                    </Grid>

                                                    {/* Account Number */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Account number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter 8-digit account number"
                                                            value={employeeData?.bankDetails?.accountNumber || []}
                                                        />
                                                    </Grid>

                                                    {/* Sort Code */}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Sort code"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter sort code E.g. 00-00-00"
                                                            value={employeeData?.bankDetails?.sortCodeOrIfscCode || []}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                {/* Save and Cancel Buttons */}
                                                {/* <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                                    <DynamicButton
                                                        text="Save Bank Details"
                                                        height="40px"
                                                        width="190px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="Cancel"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                                    />
                                                </Box> */}
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>



                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Notes Accordion */}
                                    <Accordion expanded={isNotes} onChange={toggleNotes}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="notes-section-content"
                                            id="notes-section-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Notes</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ padding: 1 }}>
                                                {/* Notes Text Area */}
                                                <TextField
                                                    label="Enter your notes here..."
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    sx={{ marginBottom: 2, backgroundColor: 'white' }}
                                                />

                                                {/* Action Buttons */}
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                                    <DynamicButton
                                                        text="Save"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="Cancel"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                                    />
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>



                                <Box sx={{ paddingTop: 2 }}>
                                    {/* Sensitive Details Accordion */}
                                    <Accordion expanded={isSensitiveDetail} onChange={toggleSensitiveDetail}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="sensitive-details-content"
                                            id="sensitive-details-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Sensitive Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ padding: '1.2rem' }}>
                                                <Grid container spacing={3}>

                                                    {/* Tax Section */}
                                                    <Grid item xs={12} sx={{ marginTop: '-15px' }}>
                                                        <Typography variant="h6">Tax</Typography>
                                                        <TextField
                                                            label="Enter Tax"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Tax Code"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.sensitiveDetails?.taxCode || []}
                                                        />
                                                    </Grid>

                                                    {/* National Insurance Section */}
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">National Insurance</Typography>
                                                        <TextField
                                                            label="National Insurance Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="National Insurance"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.sensitiveDetails?.niNumber || []}
                                                        />
                                                    </Grid>

                                                    {/* Passport Section */}
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">Passport</Typography>
                                                        <TextField
                                                            label="Passport Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter Passport Number"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.passport?.passportNumber || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Country of Issue"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Country of Issue"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.passport?.countryOfIssue || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Date of Expiry"
                                                            type="date"
                                                            variant="outlined"
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.passport?.passportExpiryDate || []}
                                                        />
                                                    </Grid>

                                                    {/* Driving License Section */}
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">Driving License</Typography>
                                                        <TextField
                                                            label="Driving License Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter Driving License Number"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.drivingLicense?.licenseNumber || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Country of Issue"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Country of Issue"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.drivingLicense?.countryOfIssue || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="License Class"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="License Class"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.drivingLicense?.licenseClass || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Date of Expiry"
                                                            type="date"
                                                            variant="outlined"
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.drivingLicense?.dateOfExpiry || []}
                                                        />
                                                    </Grid>

                                                    {/* Visa Section */}
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">Visa Information</Typography>
                                                        <TextField
                                                            label="Visa Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Enter Visa Number"
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.visa?.visaNumber || []}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Visa Expiry Date"
                                                            type="date"
                                                            variant="outlined"
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ backgroundColor: 'white' }}
                                                            value={employeeData?.visa?.visaExpiryDate || []}
                                                        />
                                                    </Grid>

                                                    {/* DBS Check Section */}
                                                    <Box sx={{ marginTop: '1rem' }}>
                                                        <Typography variant="h6">DBS Check</Typography>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={checkedA}
                                                                    onChange={handleChangeA}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="DBS Initial Check Conducted"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={checkedB}
                                                                    onChange={handleChangeB}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="DBS Check Conducted"
                                                        />

                                                        {(checkedA || checkedB) && (
                                                            <Box sx={{ marginTop: '1rem' }}>
                                                                <TextField
                                                                    label="Date of DBS Check"
                                                                    type="date"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={date}
                                                                    onChange={handleDateChange}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    sx={{ backgroundColor: 'white' }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* Right to Work Section */}
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">Right to Work</Typography>
                                                        <FormControl fullWidth variant="outlined">
                                                            <Select
                                                                value={rightToWork}
                                                                onChange={handleChange}
                                                                displayEmpty
                                                                sx={{ backgroundColor: 'white' }}
                                                            >
                                                                <MenuItem value="" disabled>Select Right to Work</MenuItem>
                                                                <MenuItem value="yes">Settled</MenuItem>
                                                                <MenuItem value="no">Pre-settled</MenuItem>
                                                                <MenuItem value="pending">Not Declared</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                </Grid>

                                                {/* Action Buttons */}
                                                {/* <Box sx={{ marginTop: '1rem', gap: '5px' }} display="flex" justifyContent="flex-end">

                                                    <DynamicButton
                                                        text="Save"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="Cancel"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                                    />

                                                </Box> */}
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>



                                <Box sx={{ marginTop: '1rem' }}>
                                    {/* Termination Accordion */}
                                    <Accordion expanded={isTermination} onChange={toggleTermination}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="termination-content"
                                            id="termination-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Termination</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ padding: '1.2rem' }}>

                                                {/* Termination Date */}
                                                <TextField
                                                    id="termination-date"
                                                    label="Termination Date"
                                                    type="date"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={date}
                                                    onChange={handleDateChange}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ marginBottom: '1rem' }}
                                                />

                                                {/* Termination Reason Dropdown */}
                                                <FormControl fullWidth variant="outlined" sx={{ marginBottom: '1rem' }}>
                                                    <Select
                                                        id="termination-reason"
                                                        value={selectedOption}
                                                        onChange={handleDropdownChange}
                                                        displayEmpty
                                                        renderValue={(selected) => (selected ? selected : 'Select Reason')}
                                                    >
                                                        <MenuItem value="" disabled>Select Reason</MenuItem>
                                                        <MenuItem value="voluntary">Voluntary</MenuItem>
                                                        <MenuItem value="involuntary">Involuntary</MenuItem>
                                                        <MenuItem value="other">Other</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                {/* Additional Notes Textarea */}
                                                <TextareaAutosize
                                                    minRows={3}
                                                    placeholder="Additional Notes"
                                                    value={notes}
                                                    onChange={handleNotesChange}
                                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                />

                                                {/* Toggle Buttons for Exit Interview and Re-engagement */}
                                                <Box sx={{ padding: '5px' }}>
                                                    <Box sx={{ padding: '10px' }}>
                                                        <Typography>Exit interview performed?</Typography>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={exitInterview}
                                                                    onChange={handleExitInterviewChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="Yes"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={exitInterview}
                                                                    onChange={handleExitInterviewChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="No"
                                                        />
                                                    </Box>
                                                    <Box sx={{ padding: '10px' }}>
                                                        <Typography>Suitable for re-engagement?</Typography>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={reEngagement}
                                                                    onChange={handleReEngagementChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="Yes"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={reEngagement}
                                                                    onChange={handleReEngagementChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="No"
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Action Buttons */}
                                                <Box sx={{ marginTop: '1rem' }} display="flex" justifyContent="flex-end" gap={2}>
                                                    <DynamicButton
                                                        text="Save"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="#6674a9" // Optional background color
                                                    />
                                                    <DynamicButton
                                                        text="Cancel"
                                                        height="40px"
                                                        width="100px"
                                                        color="white"
                                                        backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                                    />
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>


                                <Box sx={{ marginTop: '1rem' }}>
                                    {/* Delete Employee Record Accordion */}
                                    <Accordion expanded={isDeleteEmployeeRecord} onChange={toggleDeleteEmployeeRecord}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="delete-employee-record-content"
                                            id="delete-employee-record-header"
                                            sx={{ borderBottom: '2px solid lightblue' }}
                                        >
                                            <Typography variant="h6">Delete Employee Record</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', padding: '1rem' }}>
                                                {/* Delete Record Button */}
                                                <DynamicButton
                                                    text="Delete"
                                                    height="40px"
                                                    width="150px"
                                                    color="white"
                                                    backgroundColor="#6674a9" // Optional background color
                                                    onClick={() => handleOpenConfirmationModal(id)}
                                                />
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Overtime' && (
                        <Box className="overtime-container" sx={{ padding: '10px' }}>
                            <Box className="overtime-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4">Overtime</Typography>
                                <DynamicButton
                                    text="Log overtime"
                                    height="40px"
                                    width="auto"
                                    color="white"
                                    backgroundColor="#6674a9"
                                />
                            </Box>

                            <Grid container spacing={1} className="overtime-sections" sx={{ marginTop: '20px' }}>
                                <OvertimeSection
                                    title="Time off in lieu (TOIL)"
                                    items={[
                                        { label: 'TOIL logged', time: '0h 0m', description: 'No approved claims' },
                                        { label: 'TOIL taken', time: '0h 0m', description: 'No TOIL absences' },
                                        { label: 'TOIL balance', time: '0h 0m', description: 'Available to take' },
                                    ]}
                                // btnText="Use TOIL"
                                />
                                <OvertimeSection
                                    title="Payable"
                                    items={[
                                        { label: 'Overtime logged', time: '0h 0m', description: 'No approved claims' },
                                        { label: 'Paid', time: '0h 0m', description: 'Payment scheduled or paid' },
                                        { label: 'Pending payment', time: '0h 0m', description: 'Approved awaiting payment' },
                                    ]}
                                />
                            </Grid>




                            <Box className="accordion-section" sx={{ marginTop: '20px' }}>
                                {['Current and future (0)', 'History (0)', 'Cancelled (0)'].map((title, index) => (
                                    <AccordionItem
                                        key={index}
                                        title={title}
                                        isOpen={accordionOpen[title.toLowerCase().replace(/\s/g, '')]}
                                        onClick={() => toggleAccordion(title.toLowerCase().replace(/\s/g, ''))}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}


                    {activeTab === 'Personal' && (
                        <div className="info-section">
                            {/* Contact Information Dropdown */}
                            <Box className="contact-info-section" sx={{ width: '100%', padding: 2 }}>
                                <Accordion expanded={isOpen} onChange={toggleDropdown} elevation={1}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="contact-info-content"
                                        id="contact-info-header"
                                        sx={{ borderBottom: "2px solid lightblue" }}
                                    >
                                        <Typography variant="h6">Contact Information</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Button variant="outlined" sx={{ marginBottom: 2 }}>Edit</Button>
                                        <Box className="contact-details" sx={{ width: '100%' }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Account email</Typography>
                                                    <Typography variant="body1">{employeeData.email}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Personal email</Typography>
                                                    <Typography variant="body1">{employeeData.email}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Home phone</Typography>
                                                    <Typography variant="body1">{employeeData.mobile}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Mobile phone</Typography>
                                                    <Typography variant="body1">{employeeData.mobile}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Work phone</Typography>
                                                    <Typography variant="body1">{employeeData.mobile}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Work extension</Typography>
                                                    <Typography variant="body1">Not specified</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            {/* Personal Information Dropdown */}
                            <Box sx={{ width: '100%', padding: 2 }}>
                                <Accordion expanded={isPersonalOpen} onChange={togglePersonalInfo} elevation={1}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="personal-info-content"
                                        id="personal-info-header"
                                        sx={{ borderBottom: "2px solid lightblue" }}
                                    >
                                        <Typography variant="h6">Personal Information</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {/* <Button variant="outlined" sx={{ marginBottom: 2 }}>Edit</Button> */}
                                        <Box sx={{ width: '100%' }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Title</Typography>
                                                    <Typography variant="body1">{employeeData.title}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">First Name</Typography>
                                                    <Typography variant="body1">{employeeData.firstName}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Last Name</Typography>
                                                    <Typography variant="body1">{employeeData.lastName}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Middle Name</Typography>
                                                    <Typography variant="body1">{employeeData.middleName}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">DOB</Typography>
                                                    <Typography variant="body1">{employeeData.dob}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
                                                    <Typography variant="body1">{employeeData.gender}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                                                    <Typography variant="body1">{employeeData.address.address1}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            {/* Medical Information Dropdown */}
                            <Box sx={{ width: '100%', padding: 2 }}>
                                <Accordion expanded={isMedicalOpen} onChange={toggleMedicalInfo} elevation={1}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="medical-info-content"
                                        id="medical-info-header"
                                        sx={{ borderBottom: "2px solid lightblue" }}
                                    >
                                        <Typography variant="h6">Medical Information</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>COVID-19 vaccinated?</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2, justifyContent: 'space-between' }}>
                                            {/* Number input and Button in one row */}
                                            <FormControl fullWidth variant="outlined" sx={{ width: '250px' }}>
                                                <Select
                                                    displayEmpty
                                                    renderValue={(selected) => (selected ? selected : 'Select Reason')}
                                                >
                                                    <MenuItem value="">No</MenuItem>
                                                    <MenuItem value="yes">Yes</MenuItem>
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="NotSpecified">Not Specified</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button
                                                variant="outlined"
                                                sx={{ minWidth: 100 }} // Optional, ensures consistent button width
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                        {/* Textarea for medical info */}
                                        <Typography>Add note</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={10}
                                            placeholder="Enter medical information (up to 10,000 words)"
                                            inputProps={{ maxLength: 10000 }}
                                            variant="outlined"
                                            sx={{ width: '100%' }}
                                        />
                                        <DynamicButton
                                            text="Save"
                                            height="40px"
                                            width="100px"
                                            color="white"
                                            backgroundColor="#ff007b" // Optional background color
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </div>
                    )}





                    {activeTab === 'Emergencies' && (
                        <div className='emergency-container'>
                            <div className="emergency-alert-message">
                                <span className='emergency-span'>
                                    Add at least one emergency contact in case something unexpected happens.
                                </span>
                            </div>

                            <div style={{ marginTop: '12px', marginLeft: '30px' }}>
                                <DynamicButton
                                    text="Add emergency contact"
                                    height="40px"
                                    width="300px"
                                    color="white"
                                    backgroundColor="#ff007b" // Optional background color
                                    onClick={handleButtonClick}  // Attach the click handler
                                />
                            </div>

                            {/* Conditionally render the form fields when showForm is true */}
                            {showForm && (
                                <div style={{ marginTop: '20px', marginLeft: '30px' }}>
                                    {/* First Name */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <label style={{ width: '150px', fontWeight: 'bold' }}>Name</label>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            label="Name"
                                            sx={{ width: '250px' }}
                                        />
                                    </div>


                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <label style={{ width: '150px', fontWeight: 'bold' }}>Relation</label>
                                        <FormControl fullWidth variant="outlined" sx={{ width: '250px' }}>
                                            <Select
                                                displayEmpty
                                                renderValue={(selected) => (selected ? selected : 'Select Reason')}
                                            >
                                                <MenuItem value="partner">Partner</MenuItem>
                                                <MenuItem value="relative">Relative</MenuItem>
                                                <MenuItem value="father">Father</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>



                                    {/* Mobile Number */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <label style={{ width: '150px', fontWeight: 'bold' }}>Number</label>
                                        <TextField
                                            type="tel"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ width: '250px' }}
                                            label="Number"
                                        />
                                    </div>
                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                        <DynamicButton
                                            text="Save"
                                            height="40px"
                                            width="100px"
                                            color="white"
                                            backgroundColor="#ff007b" // Optional background color
                                        />
                                        <DynamicButton
                                            text="Cancel"
                                            height="40px"
                                            width="100px"
                                            color="white"
                                            backgroundColor="rgb(102 116 169 / 80%)" // Optional background color
                                        />
                                    </Box>
                                </div>

                            )}
                        </div>
                    )}



                    {activeTab === 'Documents' && (
                        <Box className="my-documents" sx={{ padding: 2 }}>
                            {/* Header Section */}
                            <Box className="header-container-employee" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Breadcrumb */}
                                <Box className="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1">All folders</Typography>
                                    <Typography variant="body1" sx={{ mx: 1 }}> &gt; </Typography>
                                    <Typography variant="body1">My documents</Typography>
                                </Box>

                                {/* Search Bar */}
                                <Box className="search-bar" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Search My documents..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        sx={{ mr: 2, backgroundColor: 'white' }}
                                    />
                                    <DynamicButton
                                        text="Search"
                                        height="40px"
                                        width="100px"
                                        color="white"

                                        backgroundColor="#6674a9" // Optional background color
                                    />
                                </Box>
                            </Box>

                            {/* Actions Section */}
                            <Box className="actions-cotaier-employee" sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <DynamicButton
                                    text="Download"
                                    height="40px"
                                    width="120px"
                                    color="white"
                                    backgroundColor="#ff007b" // Optional background color
                                />

                                {/* Right Actions */}
                                <Box className="right-actions" sx={{ display: 'flex', gap: 2 }}>

                                    <DynamicButton
                                        text="Upload"
                                        height="40px"
                                        width="100px"
                                        color="white"
                                        onClick={() => setShowUpload(!showUpload)}
                                        backgroundColor="#6674a9" // Optional background color
                                    />
                                    <DynamicButton
                                        text="New Folder"
                                        height="40px"
                                        width="150px"
                                        color="white"

                                        backgroundColor="#6674a9" // Optional background color
                                    />
                                    <DynamicButton
                                        text="Create Report"
                                        height="40px"
                                        width="150px"
                                        color="white"

                                        backgroundColor="#6674a9" // Optional background color
                                    />
                                </Box>
                            </Box>

                            {/* Content Section */}
                            <Box className="content" sx={{ mt: 2 }}>
                                {searchQuery === '' && (
                                    <Box
                                        className="empty-folder"
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <img
                                            src={EmptyFolderIcon}
                                            alt="Empty Folder"
                                            style={{ width: '100px', height: '100px', marginBottom: '16px' }}
                                        />
                                        <Typography variant="h6">This folder is empty</Typography>
                                    </Box>
                                )}

                                {/* Upload Section: Show when Upload button is clicked */}
                                {showUpload && (
                                    <Box
                                        className="upload-area"
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px dashed #6674a9',
                                            padding: 2,
                                            borderRadius: 2,
                                            marginTop: 3,
                                        }}
                                    >
                                        <div {...getRootProps()} style={{ width: '100%', textAlign: 'center' }}>
                                            <input {...getInputProps()} />
                                            <Typography variant="h6">Drag & Drop files here to upload</Typography>
                                            <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                                                Browse Files
                                            </Button>

                                        </div>
                                        <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                                            or click to select files from your device
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Footer Section */}
                            <Box className="footer" sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ mr: 2 }}>View</Typography>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>Options</InputLabel>
                                    <Select
                                        value={viewOption}
                                        onChange={handleViewOptionChange}
                                        label="Options"
                                    >
                                        {options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography variant="body1" sx={{ ml: 2 }}>per page</Typography>
                            </Box>
                        </Box>
                    )}


                </div>
            </div>
            <ToastContainer />
            <ConfirmationModal
                open={showConfirmationModal}
                onClose={handleCloseConfirmationModal}
                onConfirm={handleConfirmDelete}
                title="Delete Policies"
                message="Are you sure you want to delete this Policies?"
            />
        </div>
    );
}

export default PersonalInformation;
