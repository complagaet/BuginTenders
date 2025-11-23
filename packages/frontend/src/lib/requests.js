const API = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path, query) {
    if (!query) return `${API}${path}`;
    const params = new URLSearchParams(query);
    return `${API}${path}?${params.toString()}`;
}

async function request(path, { method = 'GET', body, token, query } = {}) {
    const res = await fetch(buildUrl(path, query), {
        method,
        headers: {
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: token } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
        throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
    }

    return await res.json();
}

const get = (path, token, query) => request(path, { token, query });
const post = (path, body, token) => request(path, { method: 'POST', body, token });
const put = (path, body, token) => request(path, { method: 'PUT', body, token });
const del = (path, token) => request(path, { method: 'DELETE', token });

export { get, post, put, del, buildUrl };
