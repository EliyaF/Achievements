import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username) => {
  try {
    const response = await api.post('/login', { username });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

export const getUserAchievements = async (username) => {
  try {
    const response = await api.get(`/achievements/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch achievements');
  }
};

export const getAllAchievements = async () => {
  try {
    const response = await api.get('/achievements');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch all achievements');
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch users');
  }
};

export const updateUserAchievement = async (username, achievementId, unlocked) => {
  try {
    const response = await api.post('/admin/update-achievement', {
      username,
      achievement_id: achievementId,
      unlocked,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update achievement');
  }
};

export const deleteUser = async (username) => {
  try {
    const response = await api.delete(`/admin/delete-user/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete user');
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch statistics');
  }
};

export const getUserStatistics = async (username) => {
  try {
    const response = await api.get(`/statistics/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch user statistics');
  }
};

export default api; 