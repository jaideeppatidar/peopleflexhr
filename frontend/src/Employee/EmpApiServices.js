import axios from "axios";
import { toast } from "react-toastify";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const loginEmployee = async (employeeId, password) => {
  try {
    const response = await API.post("/login", { employeeId, password });
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token); 
    
      return { token, user }; 
    } else {
      throw new Error("Token not provided in the response");
    }
  } catch (error) {
    throw error
  }
};

//dailog seccion
export const fetchDialogueSessions = async (employeeId) => {
  try {
    const response = await API.get(`/meetings/${employeeId}`);
    return Array.isArray(response.data.meeting)
      ? response.data.meeting
      : [response.data.meeting]; // Ensure that it returns an array, even for a single item
  } catch (error) {
    console.error("Error fetching dialogue sessions:", error);
    throw error;
  }
};


export const fetchGreetMessage = async () => {
  const response = await API.get("/chat");
  return response.data;
};

export const ChatSendMessage = async (employeeId, message) => {
  try {
    const response = await API.post("/chat", {
      employeeId, message
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
export const fetchEmployeeDataAll = async () => {
  const response = await API.get("/employee"); 
  return response.data.users; 
};

//personal-information
export const fetchEmployeeById = async (employeeId) => {
  try {
    const response = await API.get(`/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchEmployeeById:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const editEmployeeData = async (employeeId, formData) => {
  try {
    const response = await API.put(`/employee/${employeeId}`, formData ,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {}
};

//perks
export const fetchPerksDatas = async () => {
  const response = await API.get("/perks");
  return response.data.perksDocument;
};

//leave request
export const submitLeaveRequest = async (leaveRequestData) => {
  try {
    console.log(leaveRequestData);
    const response = await API.post("/timeoff", leaveRequestData);
    toast.success("Leave request submitted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchApprovedLeaveRequests = async () => {
  const response = await API.get("/alltimeoff "); // Adjust the API endpoint as necessary
  return response;
};

export const DocumentUpload = async (formData) => {
  try {
    const response = await API.post("/uploaddocument", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Return response data
  } catch (error) {
    throw error; // Handle error in the calling component
  }
};
export const deleteDocument = async (documentId) => {
  try {
    const response = await API.delete(`/uploaddocument/${documentId} `);
    toast.success("Document deleted successfully");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDocumentData = async () => {
  const response = await API.get("/uploaddocument ");
  console.log(response.data);
  return response.data.documents;
};

export const fetchDocumentDataById = async (employeeId) => {
  const response = await API.get(`/uploaddocuments/${employeeId}`);
  return response.data.document;
};

export const fetchEmployeeData = async (employeeId) => {
  const response = await API.get(`/employee/${employeeId}`);
  return response.data;
};

export const submitTimesheets = async (payload) => {
  try {
    const response = await API.post("/timesheet", payload);
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error submitting timesheet:",
      error.response?.data || error.message
    );
    // Throw the error to be handled by the calling function
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while submitting timesheet"
    );
  }
};
export const fetchTimesheets = async (employeeId) => {
  const response = await API.get(`/timesheets/${employeeId}`, {});
  return response.data;
};

//policies
export const fetchPoliciesDatas = async () => {
  const response = await API.get("/policies");
  return response.data.policiesAll;
};

//Submit Expense

export const fetchExpenses = async (employeeId) => {
  const response = await API.get(`/expencess/${employeeId}`, {});
  return response.data.document;
};

export const submitExpenseRequest = async (expenseRequestData) => {
  try {
    const response = await API.post("/expences", expenseRequestData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Expense request submitted successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting expense request:",
      error.response?.data || error.message
    );
    toast.error(
      error.response?.data?.message || "Failed to submit expense request"
    );
    throw error;
  }
};

export const getTimesheetById = async (employeeId) => {
  const response = await API.get(`/timesheets/${employeeId}`);
  return response.data;
};

export const getTimeOffRequestById = async (employeeId) => {
  const response = await API.get(`/timeoffs/${employeeId}`);
  return response.data.document;
};



///  Eployee Message Handler Api Routing 

export const getMessageById = async (employeeId) => {
  const response = await API.get(`/chat/messages/superadmin`,{
    params: { employeeId }
  });
  return response.data;
};