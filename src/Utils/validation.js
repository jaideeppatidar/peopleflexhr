import * as yup from "yup";
import * as Yup from "yup";

export const leaveRequestValidation = yup.object().shape({
  fromDate: yup.string().required("Start date is required"),
  toDate: yup.string().required("End date is required"),
  halfDay: yup.string().required("Half Day is required"),
  type: yup.string().required("Type is required"),
  reason: yup.string().required("Reason is required"),
});

export const SuperAdminloginvalidation = yup.object().shape({
  email: yup.string().required("email  is required"),
  password: yup.string().required("Password is required"),
});
export const Adminloginvalidation = yup.object().shape({
  email: yup.string().required("email  is required"),
  password: yup.string().required("Password is required"),
});

export const loginvalidation = yup.object().shape({
  employeeId: yup.string().required("employeeID  is required"),
  password: yup.string().required("Password is required"),
});

export const Registervalidation = yup.object({
  employeeID: yup.string().required("Employee ID is required"),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Select a valid gender")
    .required("Gender is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  supportiveDocument: yup
    .mixed()
    .required("Supportive document (PAN/AADHAR) is required")
    .test(
      "fileSize",
      "File size is too large (Max: 2MB)",
      (value) => !value || (value && value.size <= 2 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Unsupported file format (Only PDF or image files are allowed)",
      (value) =>
        !value ||
        (value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type))
    ),
});

export const AddPerksValidations = Yup.object().shape({
  perksName: Yup.string().required("perksName name is required"),
  description: Yup.string().required("Description is required"),
  // color: Yup.string().required("Color is required"),
  image: yup.mixed().required("Image is required"),
  url: Yup.string()
    .required("URL is required")
    ,
    category: Yup.string().required("category is required"),
});

 export const AddEmployee = Yup.object().shape({
  // title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  // employeeId: Yup.string().required('Employee ID is required'),
  employeeName: Yup.string().required('Employee name is required'),
  // middleName: Yup.string().required('Name  is required'),
  // gender: Yup.string().required('Gender is required'),
  // dob: Yup.date().required('Date of Birth is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile: Yup.string().matches(/^[0-9]+$/, 'Must be a number').required('Mobile number is required'),
  designation: Yup.string().required('Designation is required'),
  department: Yup.string().required('Department is required'),
  password: Yup.string().required('Password is required'),
  image: Yup.string().required('image is required'),

  // probationStartDate: Yup.date().required('Probation Start Date is required'),
  // employmentStartDate: Yup.date().required('Employment Start Date is required'),
  // education: Yup.string().required('Address Line 1 is required'),
  // // photo: Yup.mixed(),
  // address1: Yup.string().required('Address Line 1 is required'),
  // address2: Yup.string().required('Address Line 1 is required'),
  // // address3: Yup.string().required('Address Line 1 is required'),
  // townCity: Yup.string().required('Town/City is required'),
  // state: Yup.string().required('Town/City is required'),

  // country: Yup.string().required('Country is required'),
  // postcode: Yup.string().required('Postcode is required'),
  // // emergencyContact: Yup.string().required('Emergency Contact is required'),
  // name:Yup.string().required('name is required'),
  // relation:Yup.string().required('relation is required'),
  // contactNumber:Yup.string().required('contactNumber is required'),
  // nameOnAccount: Yup.string().required('Name on Account is required'),
  // nameOfBank: Yup.string().required('Name of Bank is required'),
  // bankBranch: Yup.string().required('Name of Bank is required'),
  // accountNumber: Yup.string().required('Account Number is required'),
  // sortCodeorIfscCode: Yup.string().required('Sort Code/IFSC Code is required'),
  // taxCode: Yup.string().required('passportNumber is required'),
  // niNumber: Yup.string().required('niNumber is required'),
  // passportNumber: Yup.string().required('passportNumber is required'),
  // passportcountryOfIssue: Yup.string().required('passportcountryOfIssue is required'),
  // drivingcountryOfIssue: Yup.string().required('drivingcountryOfIssue is required'),
  // passportExpiryDate: Yup.date().required('passportExpiryDate is required'),
  // licenseNumber: Yup.string().required('licenseNumber is required'),
  // licenseClass: Yup.string().required('licenseClass is required'),
  // dateOfExpiry: Yup.date().required('licenseExpiryDate is required'),
  // visaNumber: Yup.string().required('visaNumbere is required'),
  // visaExpiryDate: Yup.date().required('visaExpiryDate is required'),
  // // licenseCountryOfIssue: Yup.string().required('licenseCountryOfIssue is required'),
  // countryOfIssue:Yup.string().required('passportCountryOfIssue required'),
});

export const editEmployeeValidation = Yup.object().shape({
  employeeName: Yup.string().required("First Name is required"),
  // lastName: Yup.string().required("Last Name is required"),
  gender: Yup.string().required("Gender is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  department: Yup.string().required("Department is required"),
  address: Yup.string().required("address is required"),
  dob: Yup.date().required("Date of Birth is required"),
  education: Yup.string().required("education is required"),
});
export const AddExpensesValidation = Yup.object().shape({
  employeeName: Yup.string().required("Employee Name is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  expenseDate: Yup.date().required("Expense Date is required"),
  expenseDescription: Yup.string().required("Expense Description is required"),
  expenseType: Yup.string().required("Expense Type is required"),
  amount: Yup.number().required("Amount is required"),
  receiptFileName: Yup.mixed().required("Receipt file is required"),

});

export const AddDocumentValidation = Yup.object().shape({
  employeeName: Yup.string().required("Document name is required"),
  employeeId: Yup.string().required("Document name is required"),
  documentName: Yup.string().required("Document name is required"),
  uploadDate: Yup.date().required("Upload date is required").nullable(),
 
  image: Yup.mixed()
    .required("A file is required")
    .test("fileType", "Only PDF, JPEG, and PNG files are allowed", (value) => {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      return value && validTypes.includes(value.type);
    }),
    status: Yup.string().required("Status is required"),
});

export const PloiciesSuperValidation = Yup.object().shape({
  policyName: Yup.string().required("Document name is required"),
  uploadDate: Yup.date().required("Upload date is required"),
  current: Yup.string().required("Select a current status"),
  description: Yup.string().required("Description is required"),
});
export const MeetingShedulValidation = Yup.object().shape({
  meetingType: Yup.string().required("Meeting Type is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  reviewDate: Yup.date().required("Review Date is required"),
  commentsAndNotes: Yup.string().required("Comments are required"),
  nextMeetingDate: Yup.date().required("Next Meeting Date is required"),
  meetingURL: Yup.string()
    .required("Meeting URL is required")
});

export const AssetsValidation = Yup.object().shape({
  employeeId: Yup.string().required("Employee ID is required"),
  employeeName: Yup.string().required("Employee Name is required"),
  assetType: Yup.string().required("Asset Type is required"),
  dateGiven: Yup.date().required("Date Given is required").nullable(), // Ensure it's validated as a date
  estimatedValue: Yup.string().required("Estimated Value is required"),
  serialNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Serial Number must be alphanumeric")
    .required("Serial Number is required"),
  insuranceDetails: Yup.string(),
});

export const LeaveRequestValidationTimeOff = Yup.object().shape({
  startDate: Yup.date().required("Start Date is required").nullable(),
  endDate: Yup.date().required("End Date is required"),

  partialDays: Yup.string().required("Partial Days selection is required"),
  reason: Yup.string()
    .required("Reason is required")
    .min(10, "Reason must be at least 10 characters long"),
  type: Yup.string().required("Leave type is required"),
  status: Yup.string().required("Status is required"),
});

export const expenseRequestValidation = yup.object().shape({
  fromDate: yup.string().required("Expense Date is required"),
  toDate: yup.string().required("Expense Category is required"),
  halfDay: yup.string().required("Expense Description is required"),
  type: yup.string().required("Amount is required"),
  reason: yup.string().required("Receipt is required"),
});
