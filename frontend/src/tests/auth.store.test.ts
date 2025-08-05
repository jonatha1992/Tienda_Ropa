import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock Firebase ANTES de importar cualquier cosa
vi.mock('../firebase', () => ({
    auth: {
        currentUser: null,
        onAuthStateChanged: vi.fn(),
        signOut: vi.fn()
    }
}))

// Mock API client
vi.mock('../api', () => ({
    default: {
        get: vi.fn()
    }
}))

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn()
}))

describe('Auth Store', () => {
    let authStore: any

    beforeEach(async () => {
        setActivePinia(createPinia())
        vi.clearAllMocks()

        // Importar después de los mocks
        const { useAuthStore } = await import('../store/auth')
        authStore = useAuthStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            expect(authStore.firebaseUser).toBeNull()
            expect(authStore.backendUser).toBeNull()
            expect(authStore.token).toBeNull()
            expect(authStore.loading).toBe(true)
            expect(authStore.isAuthenticated).toBe(false)
        })
    })

    describe('Authentication State Management', () => {
        it('should update isAuthenticated when backendUser changes', () => {
            // Initially not authenticated
            expect(authStore.isAuthenticated).toBe(false)

            // Set a backend user
            authStore.backendUser = {
                id: 1,
                email: 'test@example.com',
                firebase_uid: 'test_uid',
                username: 'Test User',
                is_active: true
            }

            // Should now be authenticated
            expect(authStore.isAuthenticated).toBe(true)

            // Remove backend user
            authStore.backendUser = null

            // Should not be authenticated
            expect(authStore.isAuthenticated).toBe(false)
        })
    })

    describe('Logout Functionality', () => {
        it('should clear all user data on logout', async () => {
            // Set some user data
            authStore.firebaseUser = { uid: 'test_uid', email: 'test@example.com' }
            authStore.backendUser = { id: 1, email: 'test@example.com' }
            authStore.token = 'mock_token'

            // Logout
            await authStore.logout()

            // Verify all data is cleared
            expect(authStore.firebaseUser).toBeNull()
            expect(authStore.backendUser).toBeNull()
            expect(authStore.token).toBeNull()
        })
    })

    describe('Store State Updates', () => {
        it('should handle Firebase user state correctly', () => {
            const mockFirebaseUser = {
                uid: 'test_uid',
                email: 'test@example.com',
                getIdToken: vi.fn().mockResolvedValue('mock_token')
            }

            authStore.firebaseUser = mockFirebaseUser
            authStore.token = 'mock_token'

            expect(authStore.firebaseUser).toStrictEqual(mockFirebaseUser)
            expect(authStore.token).toBe('mock_token')
        })

        it('should handle loading state changes', () => {
            expect(authStore.loading).toBe(true)

            authStore.loading = false
            expect(authStore.loading).toBe(false)
        })
    })
})
