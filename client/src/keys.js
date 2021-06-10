export const UPLOAD_PRESET = 'insta-clone';
export const CLOUD_NAME = 'disha644';
export const axiosConfig = {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
}
export const cloudinaryConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
}