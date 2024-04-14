// Contains all API endpoint provided by BE
const API_ENDPOINT = {
    auth: {
        base: '',
        login: 'login',
        forgotPassword: 'forgot-password',
        logout: 'logout',
        changePassword: 'user/change-password',
        resetPassword: 'reset-password',
        signup: 'user/register',
    },
    profile: {
        base: 'user/profile',
        uploadAvatar: '/picture',
        getProfile: '',
        updateProfile: '',
    },
};

export default API_ENDPOINT;
