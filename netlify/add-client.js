const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { user } = context.clientContext;
    if (!user || !user.app_metadata.roles.includes('admin')) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Forbidden: Admin access required' }),
        };
    }

    try {
        const { clientId, clientData } = JSON.parse(event.body);
        const response = await fetch(
            `https://${process.env.NETLIFY_SITE_ID}.netlify.app/.netlify/identity/admin/users`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: `${clientData.username}@psychometrica.com`,
                    password: clientData.password,
                    user_metadata: { full_name: clientData.username },
                    app_metadata: {
                        roles: [clientData.adminUsername ? 'admin' : 'user'],
                        branding: clientData.branding,
                        joiningDate: clientData.joiningDate,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Client added successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};