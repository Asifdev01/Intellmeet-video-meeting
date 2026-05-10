import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/meetings`;

export const createMeeting = async (token) => {
    const response = await axios.post(
        API,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getMeetings = async (token) => {
    const response = await axios.get(API, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const joinMeeting = async (
    roomId,
    token
) => {
    const response = await axios.post(
        `${API}/join/${roomId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const generateMeetingSummary = async (roomId, transcript, token) => {
    const response = await axios.post(
        `${API}/${roomId}/generate-summary`,
        { transcript },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};