import axios from './axios';

export const getAllMediaFiles = async (params = {}) => {
  try {
    const response = await axios.get('/api/media', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMediaFileById = async (id) => {
  try {
    const response = await axios.get(`/api/media/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const uploadMediaFile = async ({ file, description, tags, fileType, createdBy, userId }, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  if (description) formData.append('description', description);
  if (tags) formData.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
  if (fileType) formData.append('fileType', fileType);
  if (createdBy) formData.append('createdBy', createdBy);
  if (userId) formData.append('userId', userId);

  try {
    const response = await axios.post('/api/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteMediaFile = async (id) => {
  try {
    const response = await axios.delete(`/api/media/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};