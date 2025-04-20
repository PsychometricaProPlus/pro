exports.handler = async (event, context) => {
    const { user } = context.clientContext;
    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                clientId: user.id,
                role: user.app_metadata.roles?.[0] || 'user',
                branding: user.app_metadata.branding || {},
                joiningDate: user.app_metadata.joiningDate || '',
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};