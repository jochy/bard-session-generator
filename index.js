import axios from "axios";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
});

const resp = await axios.get('https://bard.google.com/', {
    headers: {
        'authority': 'bard.google.com',
        'referer': 'https://accounts.google.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'cookie': `GOOGLE_ABUSE_EXEMPTION=${process.env.COOKIE_GOOGLE_ABUSE_EXEMPTION}; SID=${process.env.COOKIE_SID}; HSID=${process.env.COOKIE_HSID}; SSID=${process.env.COOKIE_SSID}`
    }
});

const header = resp.headers["set-cookie"].find(it => it.includes('1PSID=')).split(";")[0].replace("__Secure-1PSID=", "");

if (header == '' || header == null) {
    throw 'Unable to generate token';
}

var db = admin.firestore();
await db.collection("bard-session").doc("session").set({
    token: header
});
