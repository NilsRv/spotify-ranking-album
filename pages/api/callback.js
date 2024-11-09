// pages/api/callback.js

const axios = require('axios');
const querystring = require('querystring');

export default async function handler(req, res) {
  const code = req.query.code || null;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    });

    const { access_token, refresh_token } = response.data;
    const params = new URLSearchParams({
      access_token,
      refresh_token,
    });
    console.log('redirect_uri: ', redirect_uri );
    res.redirect('/?' + params.toString());
  } catch (error) {
    console.error('Error in /api/callback:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get access token' });
  }
}
