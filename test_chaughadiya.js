const axios = require('axios');

const userId = 612511;
const apiKey = "a3a014ee35f19c7c8ddf42bd1b7972bb";

const payload = {
    day: 20,
    month: 3,
    year: 2026,
    hour: 9,
    min: 0,
    lat: 28.5355,
    lon: 77.3910,
    tzone: 5.5,
};

axios.post(
    `https://json.astrologyapi.com/v1/chaughadiya_muhurta`,
    payload,
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(userId + ":" + apiKey).toString("base64")}`,
            "Accept-Language": "en",
        },
    }
).then(res => {
    console.log(JSON.stringify(res.data, null, 2));
}).catch(err => {
    console.error("Error:", err.response ? err.response.data : err.message);
});
