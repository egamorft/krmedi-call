import axios from 'axios';

export const API_URL = 'https://krmedi.vn';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkUserRoleById = async (user_id) => {
    try {
        const response = await api.get(API_URL + `/api/users/get-role/` + user_id);
        if (response.data.error === 0) {
            const data = response.data.data;
            const accessToken = response.data.token;
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; //Set authorization headers
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const searchMedicine = async (searchKey) => {
    try {
        const response = await api.get(API_URL + `/api/prescription/search/medicine`, {
            params: {
                search_key: searchKey
            }
        });
        if (response.data.error === 0) {
            const data = response.data.data;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const addToPrescriptionCart = async (requestData) => {
    try {
        const response = await api.post(API_URL + "/api/prescription-result/create", requestData);

        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const viewPatientHistory = async (doctorId) => {
    try {
      const response = await api.get(API_URL + `/api/my-bookings/list/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  };
  
export const fetchBookings = async (patientId) => {
    try {
        const response = await api.get(API_URL + `/api/my-bookings/history/${patientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return null;
    }
};

export const updateMedicalHistory = async (patientId, requestData) => {
    try {
      const response = await api.post(API_URL + `/api/my-bookings/history/${patientId}`, requestData);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
};