import { redirectToAuthCodeFlow } from "./redirectToAuthCodeFlow";
import { getAccessToken } from "./getAccessToken";

const client_id = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(client_id);
} else {
    const accessToken = await getAccessToken(client_id, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
}



async function fetchProfile(token: string): Promise<any> {
    // the fetch promise is fulfilled when the headers are sent, but not necessarily the body,
    // so awaiting result only guarentees the headers have arrived.
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    // need to await because the full body of the result may not have arrived yet
    return await result.json();
}

function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200); // functionally equivalent to document.createElement('img')
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}