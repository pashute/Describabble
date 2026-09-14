// XState State Machine for stickchat v0.1.7

const { createMachine, interpret } = window.XState;

const editorMachine = createMachine({
    id: 'stickchat-editor',
    initial: 'DRAFTING',
    states: {
        DRAFTING: {
            meta: { description: 'User editing shot content' },
            on: {
                REQUEST_REVIEW: 'BRANCHING_OPTIONS',
                SAVE: 'DRAFTING'
            }
        },
        BRANCHING_OPTIONS: {
            meta: { description: 'AI providing alternatives' },
            on: {
                APPROVE_OPTION: 'CONSOLIDATING',
                RETURN_TO_DRAFT: 'DRAFTING'
            }
        },
        CONSOLIDATING: {
            meta: { description: 'Final review before compilation' },
            on: {
                LOCK_AND_CONTINUE: 'COMPILING',
                RETURN_TO_DRAFT: 'DRAFTING'
            }
        },
        COMPILING: {
            meta: { description: 'Sending to stickmake backend' },
            on: {
                COMPILATION_SUCCESS: 'READY_TO_RENDER',
                COMPILATION_ERROR: 'CONSOLIDATING'
            }
        },
        READY_TO_RENDER: {
            meta: { description: 'VID file ready for playback' },
            on: {
                START_NEW: 'DRAFTING'
            }
        }
    }
});

// Create service
const editorService = interpret(editorMachine)
    .onTransition(state => {
        console.log('State:', state.value);
        // Dispatch to React for UI updates
        window.dispatchEvent(new CustomEvent('stateChange', {
            detail: { state: state.value }
        }));
    })
    .start();

// Export for use in app
window.editorService = editorService;
window.editorMachine = editorMachine;
