import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
   
    return Promise.reject(error);
  }
);




export const fetchEmployeeDataAll = async () => {
  const response = await API.get("/employee"); 
  return response.data.users; 
};

export const fetchEmployeeById = async (employeeId) => {
  try {
    const response = await API.get(`/employee/${employeeId}`);
    console.log("API response data:", response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchEmployeeById:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};




export const uploadCSV = async (formData) => {
  try {
    const response = await API.post("/employee/upload",formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
    },
    });
    return response.data; 
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error; 
  }
};


export const addEmployee = async (formData) => {
  try {
    const response = await API.post("/employee", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
    },
    });
    toast.success("Employee added successfully");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
export const editEmployee = async (employeeId, employeeData) => {
  try {
    const response = await API.put(
      `/superadmin/editemployees/${employeeId}`,
      employeeData
    );
    console.log("API Response:", response.employeeData);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {}
};

export const deleteUser = async (employeeId) => {
  try {
    const response = await API.delete(
      `/superadmin/deleteemployees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error(error.response?.data?.message || "Error deleting user");
    throw error;
  }
};

export const deleteSelectedUsers = async (ids) => {
  try {
    const deletePromises = ids.map((employeeId) =>
      API.delete(`/superadmin/deleteemployees/${employeeId}`)
    );
    const responses = await Promise.all(deletePromises);
    responses.forEach((response) => {
      toast.success(response.data.message);
    });
    return responses;
  } catch (error) {
    throw error;
  }
};

//Super Admin Login Services
export const loginSuperAdmin = async (credentials) => {
  try {
    const response = await API.post("/super", credentials);
    const { jwtToken } = response.data;
    if (jwtToken) {
      return { jwtToken };
    }
  } catch (error) {
    throw error;
  }
};

//AddAssets Services api service

export const addAsset = async (formDataToSend) => {
  try {
    const response = await API.post(
      "/assets",
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllAssets = async () => {
    const response = await API.get("/assets");
    return response.data.assetsAll;
};

export const updateAsset = async (assetsId, assetData) => {
  try {
    const response = await API.put(
      `/assets/${assetsId}`,
      assetData,
      {}
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to update asset.");
    throw error;
  }
};
export const deleteassets = async (assetsId) => {
  try {
    const response = await API.delete(`/assets/${assetsId}`);
    toast.success("Asset deleted successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting asset");
    throw error;
  }
};

export const deleteAllassets = async (assetsId) => {
  try {
    const response = await API.delete(`/assets/${assetsId}`);
    toast.success("asstes deleted successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting user");
    throw error;
  }
};

//Metting Recod dailog all apis

export const addMeetingRecord = async (formData) => {
  try {
    const response = await API.post(`/meeting`, formData, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchMeettingRecod = async () => {
    const response = await API.get("/meeting");
    return response.data.meetings;
};
export const updateMeetingRecod = async (meetingId, data) => {
  try {
    const response = await API.put(
      `/meeting/${meetingId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteaDailog = async (meetingId) => {
  try {
    const response = await API.delete(`/meeting/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    toast.error(error.response?.data?.message || "Error deleting asset");
    throw error;
  }
};



//Perks Services

export const addPerk = async (formData) => {
  try {
    const response = await API.post("/perks", formData,{
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding perk:", error);
    throw error; 
  }
};

export const fetchAllPerksData = async () => {
    const response = await API.get("/perks");
    return response.data.perksDocument;
};

export const deletePerk = async (perksId) => {
  try {
    const response = await API.delete(`/perks/${perksId}`);
    toast.success("Perks deleted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const deleteEmployee = async (employeeId) => {
  try {
    const response = await API.delete(`/superadmin/deleteemployees/${employeeId}`);
    toast.success("Employee deleted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};












// policies api 

  export const policies = async (formData) => {
    try {
      const response = await API.post("/policies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const fetchPoliciesDatas = async () => {
  const response = await API.get("/policies"); 
  return response.data.policiesAll; 
};

export const deletePolicies = async (policiesId) => {
  try {
    const response = await API.delete(`/policies/${policiesId} `);
    toast.success("Policies deleted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};






export const fetchalltimeoff = async () => {
    const response = await API.get("/timeoff");
    return response.data.timeoffdoc;
  }
export const approveTimeOff = async (timeoffId) => {
  try {
    const response = await API.put(`/timeoff/approved/${timeoffId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectTimeOff = async (timeoffId) => {
  try {
    const response = await API.put(`/timeoff/reject/${timeoffId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};

//////////

export const getAllTimesheets = async () => {
    const response = await API.get("/timesheet");
    return response.data; 
  
};
export const getTimesheetById = async (employeeId) => {
  const response = await API.get(`/timesheet/${employeeId}`); 
  return response.data;
};

export const approveTimesheet = async (timesheetId) => {
  try {
    const response = await API.put(`/timesheet/approved/${timesheetId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectTimesheet = async (timesheetId) => {
  try {
    const response = await API.put(`/timesheet/reject/${timesheetId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};

//// expences  services for fronted expences


export const fetchAllExpenseData = async () => {
    const response = await API.get("/expences");
    return response.data.expencesdoc;
};

export const approveExpense = async (expencesId) => {
  try {
    const response = await API.put(`/expences/approved/${expencesId}`); 
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectExpense = async (expencesId) => {
  try {
    const response = await API.put(`/expences/reject/${expencesId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};





// document  services for fronted documents

export const fetchEmployeeDocuments = async () => {
  const response = await API.get("/uploaddocument"); 
  return response.data.documents; 
};

export const fetchEmployeeDocById = async (employeeId) => {
  const response = await API.get(`/uploaddocuments/${employeeId}`); 
  return response.data.document; 
};

export const approveEmployeeDocuments = async (documentId) => {
  try {
    const response = await API.put(`/uploaddocument/approved/${documentId}`); 
    return response.data;
  } catch (error) {
    throw new Error("Error approving expense: " + error.message);
  }
};

export const rejectEmployeeDocuments = async (documentId) => {
  try {
    const response = await API.put(`/uploaddocument/reject/${documentId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting expense: " + error.message);
  }
};