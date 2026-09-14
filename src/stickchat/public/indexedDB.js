// IndexedDB Storage for stickchat v0.1.7

class StickchatDB {
    constructor() {
        this.dbName = 'stickchat';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createSchema(db);
            };
        });
    }

    createSchema(db) {
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
            const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
            projectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Scenes store
        if (!db.objectStoreNames.contains('scenes')) {
            const sceneStore = db.createObjectStore('scenes', { keyPath: 'id' });
            sceneStore.createIndex('projectId', 'projectId', { unique: false });
        }

        // Shots store
        if (!db.objectStoreNames.contains('shots')) {
            const shotStore = db.createObjectStore('shots', { keyPath: 'id' });
            shotStore.createIndex('sceneId', 'sceneId', { unique: false });
            shotStore.createIndex('status', 'status', { unique: false });
        }

        // Describs store
        if (!db.objectStoreNames.contains('describs')) {
            const describStore = db.createObjectStore('describs', { keyPath: 'id' });
            describStore.createIndex('shotId', 'shotId', { unique: false });
        }

        // Assets store (for CDN cache)
        if (!db.objectStoreNames.contains('assets')) {
            const assetStore = db.createObjectStore('assets', { keyPath: 'id' });
            assetStore.createIndex('fetchedAt', 'fetchedAt', { unique: false });
        }

        // Session store
        if (!db.objectStoreNames.contains('session')) {
            db.createObjectStore('session', { keyPath: 'key' });
        }
    }

    async saveProject(project) {
        const tx = this.db.transaction(['projects'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('projects').put(project);
            request.onsuccess = () => resolve(project);
            request.onerror = () => reject(request.error);
        });
    }

    async getProject(id) {
        const tx = this.db.transaction(['projects'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('projects').get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProjects() {
        const tx = this.db.transaction(['projects'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('projects').getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveScene(scene) {
        const tx = this.db.transaction(['scenes'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('scenes').put(scene);
            request.onsuccess = () => resolve(scene);
            request.onerror = () => reject(request.error);
        });
    }

    async getScenesByProject(projectId) {
        const tx = this.db.transaction(['scenes'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('scenes').index('projectId').getAll(projectId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveShot(shot) {
        const tx = this.db.transaction(['shots'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('shots').put(shot);
            request.onsuccess = () => resolve(shot);
            request.onerror = () => reject(request.error);
        });
    }

    async getShot(id) {
        const tx = this.db.transaction(['shots'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('shots').get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getShotsByScene(sceneId) {
        const tx = this.db.transaction(['shots'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('shots').index('sceneId').getAll(sceneId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveDescrib(describ) {
        const tx = this.db.transaction(['describs'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('describs').put(describ);
            request.onsuccess = () => resolve(describ);
            request.onerror = () => reject(request.error);
        });
    }

    async getDescribsByShot(shotId) {
        const tx = this.db.transaction(['describs'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('describs').index('shotId').getAll(shotId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveAsset(asset) {
        const tx = this.db.transaction(['assets'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('assets').put(asset);
            request.onsuccess = () => resolve(asset);
            request.onerror = () => reject(request.error);
        });
    }

    async getAsset(id) {
        const tx = this.db.transaction(['assets'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('assets').get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async setSession(key, value) {
        const tx = this.db.transaction(['session'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('session').put({ key, value });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSession(key) {
        const tx = this.db.transaction(['session'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('session').get(key);
            request.onsuccess = () => resolve(request.result?.value);
            request.onerror = () => reject(request.error);
        });
    }

    async clearSession() {
        const tx = this.db.transaction(['session'], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('session').clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize and expose globally
const stickchatDB = new StickchatDB();
stickchatDB.init().catch(err => console.error('IndexedDB init failed:', err));
