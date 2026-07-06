export const BASE_URL = 'http://localhost:3001';

export async function apiFetch<T>(endpoint: string, option?: RequestInit): Promise<T> {
    const defaultHeader = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...option,
        headers: {
            ...defaultHeader,
            ...option?.headers,
        },
    });

    if(!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}