import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { showNotification, NotificationType } from "./notificationSlice";

enum Status {
  Created,
  Started,
  StepTwo,
  StepThree,
  Completed
}

type CreateProcess = {
  processname: string;
  companyId: string;
  materialId: string;
  postProcessingId: string;
  materialDescription: string;
  postProcessingDescription: string;
  comment: string;
  formData: FormData;
}

type Process = {
  _id: string;  
  processname: string;
  companyId: string;
  materialId: string;
  postProcessingId: string;
  materialDescription: string;
  postProcessingDescription: string;
  comment: string;
  formData: FormData;
  status: Status;
  completedDate: Date | null;
}

type ProcessStatusData = {
  processId: string;
}

type Company = {
  id: string;
  name: string;
}

type ProcessApiState = {
    process?: Process | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    processes: Process[];
    files: { [key: string]: string[] };
    companies: Company[];
};

type ErrorResponse = {
  message: string;
};


const initialState: ProcessApiState = {
  process: localStorage.getItem("process")
    ? JSON.parse(localStorage.getItem("process") as string)
    : null,
  status: "idle",
  error: null,
  processes: localStorage.getItem("processes")
    ? JSON.parse(localStorage.getItem("processes") as string)
    : [],
  files: {
    Vorbereitung: [],
    '3D-Druck': [],
    Nachbearbeitung: [],
    Versand: [],
  },
  companies: localStorage.getItem("companies")
  ? JSON.parse(localStorage.getItem("companies") as string)
  : [],
};

export const createProcess = createAsyncThunk(
  "createProcess",
  async (dTProcess: CreateProcess, { rejectWithValue }) => {
    try {
      //create process
      const response = await axiosInstance.post("/createProcess", dTProcess);
      const resData = response.data;

      localStorage.setItem("process", JSON.stringify(resData));
      const processId = resData._id;
      
      //Create Folders

      try {
        const response = await axiosInstance.post('/folders', { processId });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error creating folders:', error);
        throw error;
      }

      //upload file
      try {
        const formData = new FormData();
        const file = dTProcess.formData.get('file') as File;
        formData.append('processId', processId);
        formData.append('folderName', 'Vorbereitung');
        formData.append('file', file);
        
        const response = await axiosInstance.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload erfolgreich:', response.data);
      } catch (error) {
        console.error('Fehler beim Upload:', error);
      }

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const getProcessById = createAsyncThunk(
  "getProcessById",
  async (data: ProcessStatusData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("getProcessById/" + data.processId.toString());
      const resData = response.data;

      localStorage.setItem("process", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const getProcessesbyCompanyId = createAsyncThunk(
    "getProcessesbyCompanyId",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("getProcessesForCompanyId");
        const resData = response.data;
  
        localStorage.setItem("processes", JSON.stringify(resData));
  
        return resData;
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const errorResponse = error.response.data;
  
          return rejectWithValue(errorResponse);
        }
  
        throw error;
      }
    }
);
  
export const getProcessesForCustomer = createAsyncThunk(
  "getProcessesForCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("getProcessesForCustomer");
      const resData = response.data;

      localStorage.setItem("processes", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const setNextProcessStatus = createAsyncThunk(
  "setProcessStatus",
  async (data: ProcessStatusData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("setNextProcessStatus/" + data.processId.toString());
      const resData = response.data;

      localStorage.setItem("process", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const setPreviousProcessStatus = createAsyncThunk(
  "setPreviousProcessStatus",
  async (data: ProcessStatusData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("setPreviousProcessStatus/" + data.processId.toString());
      const resData = response.data;

      localStorage.setItem("process", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const fetchFiles = createAsyncThunk(
  "fetchFiles",
  async (processId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/files', { processId });
      return response.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Dateiliste:', error);
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;
        return rejectWithValue(errorResponse);
      }
      throw error;
    }
  }
);


export const downloadFile = createAsyncThunk(
  "downloadFile",
  async ({ processId, folder, fileName }: { processId: string, folder: string, fileName: string }, { rejectWithValue }) => {
    try {
      const fullFileName = `${processId}/${folder}/${fileName}`;
      const response = await axiosInstance.post(`/download`, { fileName: fullFileName }, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      console.error('Fehler beim Herunterladen der Datei:', error);
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }
      throw error;
    }
  }
);

export const getAllCompanies = createAsyncThunk(
  "getAllCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("getAllCompanies");
      const resData = response.data;

      localStorage.setItem("companies", JSON.stringify(resData));

      return resData;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

const processSlice = createSlice({
  name: "dTProcess",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProcess.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProcess.fulfilled,
        (state, action: PayloadAction<Process>) => {
          state.status = "idle";
          state.process = action.payload;
      })
      .addCase(createProcess.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Registration failed";
        } else {
          state.error = action.error.message || "Registration failed";
        }
      })
      .addCase(getProcessesbyCompanyId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProcessesbyCompanyId.fulfilled,
        (state, action: PayloadAction<Process[]>) => {
          state.status = "idle";
          state.processes = action.payload;
      })
      .addCase(getProcessesbyCompanyId.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message ||
            "Retrieving processes failed";
        } else {
          state.error = action.error.message || "Retrieving processes failed";
        }
      })
      .addCase(getProcessesForCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProcessesForCustomer.fulfilled,
        (state, action: PayloadAction<Process[]>) => {
          state.status = "idle";
          state.processes = action.payload;
      })
      .addCase(getProcessesForCustomer.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message ||
            "Retrieving processes failed";
        } else {
          state.error = action.error.message || "Retrieving processes failed";
        }
      })
      .addCase(setNextProcessStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setNextProcessStatus.fulfilled,
        (state, action: PayloadAction<Process>) => {
          state.status = "idle";
          state.process = action.payload;
      })
      .addCase(setNextProcessStatus.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Registration failed";
        } else {
          state.error = action.error.message || "Registration failed";
        }
      })
      .addCase(setPreviousProcessStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setPreviousProcessStatus.fulfilled,
        (state, action: PayloadAction<Process>) => {
          state.status = "idle";
          state.process = action.payload;
      })
      .addCase(setPreviousProcessStatus.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Registration failed";
        } else {
          state.error = action.error.message || "Registration failed";
        }
      })

      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<{ [key: string]: string[] }>) => {
        state.status = "idle";
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = (action.payload as ErrorResponse).message || "Fetching files failed";
        } else {
          state.error = action.error.message || "Fetching files failed";
        }
      })
      .addCase(downloadFile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message || "Download failed";
        } else {
          state.error = action.error.message || "Download failed";
        }
      })
      .addCase(getAllCompanies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.status = "idle";
          state.companies = action.payload;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error =
            (action.payload as ErrorResponse).message ||
            "Retrieving companies failed";
        } else {
          state.error = action.error.message || "Retrieving companies failed";
        }
      });
  },
});

export default processSlice.reducer;