import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const createOrder = (serviceId, token) =>
  axios.post(
    API_URL,
    { service: serviceId }, // ✅ FIX HERE
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getMyOrders = (token) =>
  axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateOrderStatus = (id, status, token) =>
  axios.put(
    `${API_URL}/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
