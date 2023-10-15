import { google } from "googleapis";

const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

function generateAuthUrl() {
    const url = OAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "openid"
        ],
        prompt: "consent",
    });

    return url;
}

async function generateTokensAndUserInfo(code) {

    const {tokens} = await OAuth2Client.getToken(code);

    const {email} = await OAuth2Client.getTokenInfo(tokens.access_token);

    // Create a new auth client and use it with the new access token
    let oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({access_token: tokens.access_token});

    let oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    // get user info
    let { data } = await oauth2.userinfo.get();

    return {...data, ...tokens, email};
}

export { generateAuthUrl, generateTokensAndUserInfo };