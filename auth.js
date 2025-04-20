// Initialize Netlify Identity
if (window.netlifyIdentity) {
    netlifyIdentity.init();
}

// Get current client branding from Netlify Identity user metadata
function getClientBranding() {
    const user = netlifyIdentity.currentUser();
    if (!user) {
        console.error('No user logged in');
        return null;
    }
    const branding = user.app_metadata.branding || null;
    console.log('Getting client branding:', branding);
    return branding;
}

// Get current client (user) info
function getCurrentClient() {
    const user = netlifyIdentity.currentUser();
    if (!user) {
        console.error('No user logged in');
        return null;
    }
    const clientInfo = { id: user.id, role: user.app_metadata.roles?.[0] || 'user' };
    console.log('Getting current client:', clientInfo);
    return clientInfo;
}

// Fetch all clients (admin only)
async function getAllClients() {
    console.log('Fetching all clients');
    try {
        const response = await fetch('/.netlify/functions/get-all-clients', {
            headers: {
                Authorization: `Bearer ${netlifyIdentity.currentUser()?.token.access_token}`,
            },
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log('All clients:', data.clients);
        return data.clients || {};
    } catch (error) {
        console.error('Error fetching clients:', error);
        return {};
    }
}

// Add a new client (admin only)
async function addClient(clientId, clientData) {
    console.log('Adding client with ID:', clientId, 'Data:', clientData);
    try {
        const response = await fetch('/.netlify/functions/add-client', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${netlifyIdentity.currentUser()?.token.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, clientData }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log('Client added successfully:', data.message);
    } catch (error) {
        console.error('Error adding client:', error);
        throw error;
    }
}

// Remove a client (admin only)
async function removeClient(clientId) {
    console.log('Removing client with ID:', clientId);
    try {
        const response = await fetch('/.netlify/functions/remove-client', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${netlifyIdentity.currentUser()?.token.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log('Client removed successfully:', data.message);
    } catch (error) {
        console.error('Error removing client:', error);
        throw error;
    }
}

// Expose functions to the global scope
window.getClientBranding = getClientBranding;
window.getCurrentClient = getCurrentClient;
window.getAllClients = getAllClients;
window.addClient = addClient;
window.removeClient = removeClient;