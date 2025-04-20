const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { user } = context.clientContext;
    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    try {
        const { result } = JSON.parse(event.body);
        const existingResults = user.app_metadata.results || [];
        const updatedResults = [...existingResults, result].slice(-5); // Keep only the last 5 results

        const response = await fetch(
            `https://${process.env.NETLIFY_SITE_ID}.netlify.app/.netlify/identity/admin/users/${user.id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    app_metadata: {
                        ...user.app_metadata,
                        results: updatedResults,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to save result');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Result saved successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};