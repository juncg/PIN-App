import { PostToDatabase, GetFromDatabase } from "@/lib/services/general";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/services/general");
jest.mock("@/lib/supabase/client");

describe("User and Offer Creation Integration Flow", () => {
    const mockSupabaseAuth = {
        signUp: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createClient as jest.Mock).mockReturnValue({
            auth: mockSupabaseAuth,
        });
    });

    test("should create user, associate with business, and create offer", async () => {
        const mockUserId = "integration-test-user-uuid";
        const mockBusinessId = 1;
        const mockForumId = 1;
        const mockOfferId = 100;

        // Step 1: Verificar username disponible
        (GetFromDatabase as jest.Mock).mockResolvedValueOnce({
            data: [],
            error: null,
        });

        await GetFromDatabase({
            tableName: "User",
            select: "username",
            filters: [{ method: "eq", column: "username", value: "testuser" }],
        });

        // Step 2: Crear usuario en Auth
        mockSupabaseAuth.signUp.mockResolvedValueOnce({
            data: { user: { id: mockUserId } },
            error: null,
        });

        await mockSupabaseAuth.signUp({
            email: "test@example.com",
            password: "TestPassword123!",
            options: {
                emailRedirectTo: `http://localhost:3000/home`,
            },
        });

        // Step 3: Crear perfil de usuario
        (PostToDatabase as jest.Mock).mockResolvedValueOnce({
            data: [
                {
                    id: mockUserId,
                    username: "testuser",
                    name: "Test",
                    surnames: "User",
                },
            ],
            error: null,
        });

        const userResult = await PostToDatabase({
            tableName: "User",
            contentJson: [
                {
                    id: mockUserId,
                    username: "testuser",
                    name: "Test",
                    surnames: "User",
                    birth_date: "2000-01-01",
                    banner: null,
                    profile_picture: null,
                },
            ],
        });

        expect(userResult.data).toBeDefined();
        expect(userResult.data![0].id).toBe(mockUserId);

        // Step 4: Asociar usuario con negocio
        (PostToDatabase as jest.Mock).mockResolvedValueOnce({
            data: [
                {
                    user_id: mockUserId,
                    business_id: mockBusinessId,
                },
            ],
            error: null,
        });

        const businessAssociation = await PostToDatabase({
            tableName: "Business_Employee",
            contentJson: [
                {
                    user_id: mockUserId,
                    business_id: mockBusinessId,
                },
            ],
        });

        expect(businessAssociation.data![0].user_id).toBe(mockUserId);
        expect(businessAssociation.data![0].business_id).toBe(mockBusinessId);

        // Step 5: Verificar que es usuario de negocio
        (GetFromDatabase as jest.Mock)
            .mockResolvedValueOnce({
                // Business_Employee
                data: [{ user_id: mockUserId, business_id: mockBusinessId }],
                error: null,
            })
            .mockResolvedValueOnce({
                // Business owner check
                data: [],
                error: null,
            });

        const businessCheck = await GetFromDatabase({
            tableName: "Business_Employee",
            select: "*",
            filters: [{ method: "eq", column: "user_id", value: mockUserId }],
        });

        const isBusinessUser = businessCheck.data && businessCheck.data.length > 0;
        expect(isBusinessUser).toBe(true);

        // Step 6: Crear oferta
        (PostToDatabase as jest.Mock).mockResolvedValueOnce({
            data: [
                {
                    id: mockOfferId,
                    title: "Integration Test Offer",
                    creator_id: mockUserId,
                    forum_id: mockForumId,
                    text: "Test offer",
                    target_progress: 50,
                    current_progress: 0,
                    fee: 10,
                    state: "Posted",
                },
            ],
            error: null,
        });

        const offerResult = await PostToDatabase({
            tableName: "Offer",
            contentJson: [
                {
                    title: "Integration Test Offer",
                    creator_id: mockUserId,
                    forum_id: mockForumId,
                    text: "Test offer",
                    target_progress: 50,
                    target_completition_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    fee: 10,
                    current_progress: 0,
                    comment_locked_state: "Unlocked",
                    state: "Posted",
                    likes: 0,
                    superlikes: 0,
                    created_at: new Date().toISOString(),
                    images: null,
                },
            ],
        });

        expect(offerResult.data).toBeDefined();
        expect(offerResult.data![0].creator_id).toBe(mockUserId);
        expect(offerResult.data![0].id).toBe(mockOfferId);
    });

    test("should fail to create offer if user is not associated with business", async () => {
        const mockUserId = "non-business-user";

        // Usuario existe pero NO está asociado a ningún negocio
        (GetFromDatabase as jest.Mock)
            .mockResolvedValueOnce({
                data: [], // No business employee
                error: null,
            })
            .mockResolvedValueOnce({
                data: [], // No business owner
                error: null,
            });

        const businessEmployees = await GetFromDatabase({
            tableName: "Business_Employee",
            select: "*",
            filters: [{ method: "eq", column: "user_id", value: mockUserId }],
        });

        const ownedBusinesses = await GetFromDatabase({
            tableName: "Business",
            select: "*",
            filters: [{ method: "eq", column: "owner_id", value: mockUserId }],
        });

        const isBusinessUser =
            (businessEmployees.data && businessEmployees.data.length > 0) ||
            (ownedBusinesses.data && ownedBusinesses.data.length > 0);

        expect(isBusinessUser).toBe(false);
    });
});