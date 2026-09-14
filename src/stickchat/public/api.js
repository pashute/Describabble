// API Client for stickchat v0.1.7

class StickchatAPI {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = null;
    }

    async setToken(token) {
        this.token = token;
        await stickchatDB.setSession('authToken', token);
    }

    async loadToken() {
        this.token = await stickchatDB.getSession('authToken');
        return this.token;
    }

    headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.token) {
            h['Authorization'] = `Bearer ${this.token}`;
        }
        return h;
    }

    async login(code) {
        const response = await fetch(`${this.baseURL}/auth/login`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ code })
        });
        const data = await response.json();
        if (data.token) {
            await this.setToken(data.token);
        }
        return data;
    }

    async logout() {
        await fetch(`${this.baseURL}/auth/logout`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ token: this.token })
        });
        this.token = null;
        await stickchatDB.clearSession();
    }

    async getMe() {
        const response = await fetch(`${this.baseURL}/auth/me`, {
            headers: this.headers()
        });
        if (response.status === 401) throw new Error('Not authenticated');
        return await response.json();
    }

    // Projects
    async listProjects() {
        const response = await fetch(`${this.baseURL}/projects`, {
            headers: this.headers()
        });
        return await response.json();
    }

    async createProject(name, movieType = 'stick') {
        const response = await fetch(`${this.baseURL}/projects`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ name, movieType })
        });
        return await response.json();
    }

    async getProject(id) {
        const response = await fetch(`${this.baseURL}/projects/${id}`, {
            headers: this.headers()
        });
        return await response.json();
    }

    // Scenes
    async createScene(projectId, sceneNumber, name) {
        const response = await fetch(`${this.baseURL}/scenes`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ projectId, sceneNumber, name })
        });
        return await response.json();
    }

    async getScene(id) {
        const response = await fetch(`${this.baseURL}/scenes/${id}`, {
            headers: this.headers()
        });
        return await response.json();
    }

    // Shots
    async createShot(sceneId, shotNumber) {
        const response = await fetch(`${this.baseURL}/shots`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ sceneId, shotNumber })
        });
        return await response.json();
    }

    async getShot(id) {
        const response = await fetch(`${this.baseURL}/shots/${id}`, {
            headers: this.headers()
        });
        return await response.json();
    }

    async updateShot(id, updates) {
        const response = await fetch(`${this.baseURL}/shots/${id}`, {
            method: 'PATCH',
            headers: this.headers(),
            body: JSON.stringify(updates)
        });
        return await response.json();
    }

    // Describs
    async generateDescribs(screenplayName, shot) {
        const response = await fetch(`${this.baseURL}/describs/generate`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ screenplayName, shot })
        });
        return await response.json();
    }

    // Health check
    async health() {
        const response = await fetch(`${this.baseURL}/health`);
        return await response.json();
    }
}

// Initialize and expose globally
const stickchatAPI = new StickchatAPI();
window.stickchatAPI = stickchatAPI;
