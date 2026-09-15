// Main App for stickchat v0.1.7

const { useState, useEffect, useRef } = React;

function App() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [currentScene, setCurrentScene] = useState(null);
    const [currentShot, setCurrentShot] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [shots, setShots] = useState([]);
    const [editorState, setEditorState] = useState('DRAFTING');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize app
    useEffect(() => {
        initApp();
        window.addEventListener('stateChange', handleStateChange);
        return () => window.removeEventListener('stateChange', handleStateChange);
    }, []);

    async function initApp() {
        try {
            // Load saved token
            await stickchatAPI.loadToken();

            // Check if authenticated
            const me = await stickchatAPI.getMe().catch(() => null);
            if (me) {
                setUser(me);
                loadProjects();
            }
        } catch (err) {
            console.error('Init failed:', err);
        }
    }

    function handleStateChange(event) {
        setEditorState(event.detail.state);
    }

    async function loadProjects() {
        try {
            const p = await stickchatAPI.listProjects();
            setProjects(p);
            if (p.length > 0) {
                loadProject(p[0].id);
            }
        } catch (err) {
            console.error('Failed to load projects:', err);
        }
    }

    async function loadProject(projectId) {
        try {
            const project = await stickchatAPI.getProject(projectId);
            setCurrentProject(project);
            if (project.scenes && project.scenes.length > 0) {
                setScenes(project.scenes);
                loadScene(project.scenes[0].id);
            }
        } catch (err) {
            console.error('Failed to load project:', err);
        }
    }

    async function loadScene(sceneId) {
        try {
            const scene = await stickchatAPI.getScene(sceneId);
            setCurrentScene(scene);
            if (scene.shots && scene.shots.length > 0) {
                setShots(scene.shots);
                loadShot(scene.shots[0].id);
            }
        } catch (err) {
            console.error('Failed to load scene:', err);
        }
    }

    async function loadShot(shotId) {
        try {
            const shot = await stickchatAPI.getShot(shotId);
            setCurrentShot(shot);
            setEditorState(shot.status || 'DRAFTING');
        } catch (err) {
            console.error('Failed to load shot:', err);
        }
    }

    async function handleLogin() {
        try {
            // Simulate OAuth flow
            const result = await stickchatAPI.login('temp_code');
            setUser(result.user);
            loadProjects();
        } catch (err) {
            console.error('Login failed:', err);
            alert('Login failed. See console.');
        }
    }

    async function handleLogout() {
        try {
            await stickchatAPI.logout();
            setUser(null);
            setCurrentProject(null);
            setCurrentScene(null);
            setCurrentShot(null);
            setMessages([]);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    async function handleSendMessage() {
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);

        try {
            setMessages(prev => [...prev, { role: 'ai', content: 'Processing...' }]);
        } catch (err) {
            console.error('Message failed:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveShot() {
        if (!currentShot) return;
        try {
            await stickchatAPI.updateShot(currentShot.id, { ...currentShot, status: editorState });
            window.editorService.send('SAVE');
        } catch (err) {
            console.error('Save failed:', err);
        }
    }

    if (!user) {
        return <AuthScreen onLogin={handleLogin} />;
    }

    return (
        <div className="main-layout">
            <Header
                user={user}
                project={currentProject}
                scene={currentScene}
                state={editorState}
                onLogout={handleLogout}
            />

            <Sidebar
                shots={shots}
                currentShot={currentShot}
                onSelectShot={loadShot}
            />

            <div className="main-content">
                {currentShot ? (
                    <>
                        <ChatArea
                            messages={messages}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSendMessage={handleSendMessage}
                            loading={loading}
                        />
                        <EditingPanel
                            shot={currentShot}
                            onUpdate={(updates) => setCurrentShot({ ...currentShot, ...updates })}
                            onSave={handleSaveShot}
                            editorState={editorState}
                        />
                    </>
                ) : (
                    <div style={{ padding: '20px', color: '#999' }}>
                        No shot selected. Load or create a project first.
                    </div>
                )}
            </div>
        </div>
    );
}

function AuthScreen({ onLogin }) {
    return (
        <div className="auth-screen">
            <div className="auth-container">
                <h1>stickchat</h1>
                <p>Create stick-figure movies with natural language</p>
                <button onClick={onLogin}>Login with OAuth</button>
            </div>
        </div>
    );
}

function Header({ user, project, scene, state, onLogout }) {
    const stateColors = {
        DRAFTING: 'drafting',
        BRANCHING_OPTIONS: 'branching',
        CONSOLIDATING: 'consolidating',
        COMPILING: 'compiling',
        READY_TO_RENDER: 'ready'
    };

    return (
        <div className="header">
            <div className="header-left">
                <div className="header-title">stickchat v0.1.7</div>
                <div className="header-breadcrumb">
                    {project?.name} {scene && `→ ${scene.name}`}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div className="state-indicator">
                    <div className={`state-dot ${stateColors[state]}`}></div>
                    {state}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {user?.name || user?.email}
                </div>
                <div className="header-buttons">
                    <button className="logout" onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ shots, currentShot, onSelectShot }) {
    return (
        <div className="sidebar">
            <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                SHOTS
            </div>
            <div className="shot-grid">
                {shots.map(shot => (
                    <div
                        key={shot.id}
                        className={`shot-box ${currentShot?.id === shot.id ? 'active' : ''}`}
                        onClick={() => onSelectShot(shot.id)}
                    >
                        <div className="shot-box-title">Shot {shot.shotNumber}</div>
                        <div className="shot-box-summary">
                            {shot.dialogue?.length || 0} lines
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChatArea({ messages, inputValue, onInputChange, onSendMessage, loading }) {
    const messagesEnd = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-area">
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                        Describe your scene content in natural language
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {loading && <div style={{ color: '#999', fontSize: '12px' }}>AI is thinking...</div>}
                <div ref={messagesEnd} />
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder="Describe characters, dialogue, emotions..."
                />
                <button onClick={onSendMessage}>Send</button>
            </div>
        </div>
    );
}

function EditingPanel({ shot, onUpdate, onSave, editorState }) {
    const [activeTab, setActiveTab] = useState('characters');

    const tabs = [
        { name: 'characters', label: 'Characters' },
        { name: 'dialogue', label: 'Dialogue' },
        { name: 'locations', label: 'Locations' },
        { name: 'emotions', label: 'Emotions' },
        { name: 'audio', label: 'Audio' },
        { name: 'stage', label: 'Stage' },
        { name: 'background', label: 'Background' }
    ];

    return (
        <div className="editing-panel">
            <h3>Editing Panel</h3>
            <div className="editing-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        className={activeTab === tab.name ? 'active' : ''}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="editing-content">
                {renderTabContent(activeTab, shot, onUpdate)}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                        onClick={onSave}
                        style={{ background: '#28a745', color: 'white', padding: '10px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    >
                        Save
                    </button>
                    <button
                        style={{ background: '#007bff', color: 'white', padding: '10px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    >
                        Request Review
                    </button>
                </div>
            </div>
        </div>
    );
}

function renderTabContent(tab, shot, onUpdate) {
    switch (tab) {
        case 'characters':
            return (
                <div className="form-group">
                    <label>Character Name</label>
                    <input type="text" placeholder="e.g., Survey Guy" />
                    <label>Description</label>
                    <textarea placeholder="Describe the character's appearance, role, emotion..." />
                </div>
            );
        case 'dialogue':
            return (
                <div>
                    <div className="form-group">
                        <label>Speaker</label>
                        <input type="text" placeholder="Character name" />
                    </div>
                    <div className="form-group">
                        <label>Timing (seconds)</label>
                        <input type="number" placeholder="Start time" />
                    </div>
                    <div className="form-group">
                        <label>Dialogue Text</label>
                        <textarea placeholder="What does the character say?" />
                    </div>
                </div>
            );
        case 'locations':
            return (
                <div className="form-group">
                    <label>Location Description</label>
                    <textarea placeholder="Describe the scene location, camera angle, POV..." />
                </div>
            );
        case 'emotions':
            return (
                <div className="form-group">
                    <label>Character Emotion</label>
                    <select>
                        <option>Select emotion</option>
                        <option>Happy</option>
                        <option>Sad</option>
                        <option>Worried</option>
                        <option>Angry</option>
                        <option>Distressed</option>
                    </select>
                </div>
            );
        case 'audio':
            return (
                <div className="form-group">
                    <label>Audio Description</label>
                    <textarea placeholder="Sound effects, music, ambient sounds..." />
                </div>
            );
        case 'stage':
            return (
                <div className="form-group">
                    <label>Stage Components</label>
                    <textarea placeholder="Bridges, props, set pieces..." />
                </div>
            );
        case 'background':
            return (
                <div className="form-group">
                    <label>Scene Background</label>
                    <textarea placeholder="Time of day, weather, atmosphere..." value={shot.background} onChange={(e) => onUpdate({ background: e.target.value })} />
                </div>
            );
        default:
            return null;
    }
}

// Mount app
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
