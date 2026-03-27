import React, { createContext, useContext, useState, useEffect } from 'react';

const ServiceContext = createContext();

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
};

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([
        {
            id: 1,
            provider: 'November AI',
            apiUrl: 'https://api.langxchange.ai',
            apiKey: 'nv_Uwx3h8PWalTyFAYT_KCNErXrEO_NEgZcMLXcMMa4IbA',
            username: 'ext@demo.com',
            password: 'pass',
            agentId: 'c3934f2b-ddf1-4805-afe8-0dadd05d4913',
            companyId: 'demo-company-001',
            applicationId: 'GMA73HIA1LSQ',
            status: 'Default',
            isAuthenticated: false,
            type: 'langxchange'
        },



        {
            id: 2,
            provider: 'Playlab AI',
            apiUrl: 'https://www.playlab.ai/api/v1',
            apiKey: 'sk-pl-v1-org.e8cffa9d34ffbc5aee9f8a41cc6c3638a980bab6561ddc9854426e4c570e57c4',
            applicationId: 'cmmkt4ir40tgbmc0v3teuwz0w', // Use this as PROJECT_ID
            status: 'Optional',
            isAuthenticated: false,
            type: 'playlab'
        },
    ]);

    const [defaultService, setDefaultService] = useState(services.find(s => s.status === 'Default'));

    useEffect(() => {
        setDefaultService(services.find(s => s.status === 'Default'));
    }, [services]);

    const authenticateService = async (serviceId) => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return { success: false, message: 'Service not found' };

        // Playlab AI uses direct API Key authentication, no need for separate token exchange
        if (service.type === 'playlab') {
            setServices(prev => prev.map(s => s.id === serviceId ? {
                ...s,
                isAuthenticated: true
            } : s));
            return { success: true };
        }

        try {
            const url = `${service.apiUrl}/exchat/auth/${service.companyId}/${service.applicationId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'x-api-key': service.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setServices(prev => prev.map(s => s.id === serviceId ? {
                    ...s,
                    isAuthenticated: true,
                    token: data.access_token
                } : s));
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                setServices(prev => prev.map(s => s.id === serviceId ? { ...s, isAuthenticated: false } : s));
                return { success: false, message: errorData.message || `Auth failed with status ${response.status}` };
            }
        } catch (error) {
            console.error('Auth error:', error);
            setServices(prev => prev.map(s => s.id === serviceId ? { ...s, isAuthenticated: false } : s));
            return { success: false, message: error.message || 'Network error' };
        }
    };

    const addService = (service) => {
        const newService = { ...service, id: Date.now(), isAuthenticated: false };
        if (newService.status === 'Default') {
            setServices(prev => prev.map(s => ({ ...s, status: 'Optional' })).concat(newService));
        } else {
            setServices(prev => [...prev, newService]);
        }
    };

    const updateService = (updatedService) => {
        setServices(prev => prev.map(s => {
            if (s.id === updatedService.id) {
                return {
                    ...updatedService, isAuthenticated: s.isAuthenticated &&
                        s.username === updatedService.username &&
                        s.password === updatedService.password &&
                        s.apiKey === updatedService.apiKey &&
                        s.applicationId === updatedService.applicationId &&
                        s.companyId === updatedService.companyId
                };
            }
            if (updatedService.status === 'Default' && s.id !== updatedService.id) {
                return { ...s, status: 'Optional' };
            }
            return s;
        }));
    };

    const deleteService = (id) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    return (
        <ServiceContext.Provider value={{
            services,
            defaultService,
            authenticateService,
            addService,
            updateService,
            deleteService
        }}>
            {children}
        </ServiceContext.Provider>
    );
};
