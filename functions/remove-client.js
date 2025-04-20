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
        const { clientId } = JSON.parse(event.body);
        const response = await fetch(
            `https://${process.env.NETLIFY_SITE_ID}.netlify.app/.netlify/identity/admin/users/${clientId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Client removed successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};