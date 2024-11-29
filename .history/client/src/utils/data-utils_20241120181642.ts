import config from '../envConfig';

export const fetchData = async (endpoint: string, options = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
};

export const postData = async (endpoint: string, data: any, options = {}) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        ...options,
    });
    if (!response.ok) {
        throw new Error(`Error posting data: ${response.statusText}`);
    }
    return response.json();
};