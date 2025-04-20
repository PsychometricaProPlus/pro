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
        const response = await fetch(
            `https://${process.env.NETLIFY_SITE_ID}.netlify.app/.netlify/identity/admin/users`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
                },
            }
        );
        const data = await response.json();
        const results = data.users.flatMap(u => u.app_metadata.results || []);
        return {
            statusCode: 200,
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};