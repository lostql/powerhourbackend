const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.OAUTH_GOOGLE_CLIENT_ID);

module.exports = googleClient;
