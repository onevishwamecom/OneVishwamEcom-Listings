import api from './api';

export const listerApi = {
  /**
   * Upload the authenticated lister's profile image as multipart/form-data.
   * Content-Type is left to axios/FormData so the multipart boundary is correct.
   */
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/auth/lister/profile/image', formData);
  },
};