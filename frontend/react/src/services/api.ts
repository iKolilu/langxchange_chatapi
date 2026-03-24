import axios from 'axios';

const API_BASE_URL = 'https://api.langxchange.ai';

export const api = {
    // External Chat Authentication
    authenticate: async (companyId: string, appId: string, apiKey: string) => {
        const response = await axios.post(`${API_BASE_URL}/exchat/auth/${companyId}/${appId}`, {}, {
            headers: { 'x-api-key': apiKey }
        });
        return response.data; // { access_token, expires_in, ... }
    },

    // Create Chat Session
    createSession: async (token: string, agentId: string, appId: string, userId: string, systemPrompt?: string) => {
        const response = await axios.post(
            `${API_BASE_URL}/exchat/${agentId}/${appId}/${userId}/session`,
            {
                system_prompt: systemPrompt || "You are a helpful AI assistant.",
                user_prompt: "Hello",
                use_vectorconfig: true
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data; // { session_id, session_uuid, ... }
    },

    // Get Available Agents
    getAgents: async (token: string) => {
        const response = await axios.get(`${API_BASE_URL}/exchat/agents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
