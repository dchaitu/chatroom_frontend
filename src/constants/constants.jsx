export const siteKey = '6Lcp4Y0rAAAAAD_kq7y5aB5QlfGM5QLlbxywSlBu'
// export const secretKey = '6Lcp4Y0rAAAAAMx574CaTgPELQT7aT24Aprreo84'
export const REST_API_PATH = process.env.REACT_APP_API_URL
export const LOCAL_API_PATH = process.env.REACT_APP_API_URL
export const JOIN_REQUEST = `${REST_API_PATH}/admin/pending-requests/?request_type=join_request`
export const PENDING_INVITES = `${REST_API_PATH}/admin/pending-requests/?request_type=invite`
export const RESPOND_REQUEST = (roomId) => `${REST_API_PATH}/admin/request/${roomId}/respond/`
export const POLLING_INTERVAL = 3000


export const getDatesFromTimeStamp = (timeStamp) => {
    const dateObj = new Date(timeStamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', {month:'long'});
    return `${day} ${month}`;
}

export const getTimeStamp = (timeStamp) => {
    const dateObj = new Date(timeStamp);
    const hour = dateObj.getHours();
    let minute = dateObj.getMinutes();// padding
    if (minute < 10) {
        minute = '0' + minute;
    }
    return `${hour}:${minute}`;
}

export const formatMessageDate = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // Reset time for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    if (messageDay.getTime() === today.getTime()) {
        return 'Today';
    } else if (messageDay.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return messageDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}