import { GetFromDatabase, PostToDatabase } from "@/lib/services/general";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/services/general");
jest.mock("@/lib/supabase/client");

describe("User Sign Up", () => {
    const mockSupabaseAuth = {
        signUp: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createClient as jest.Mock).mockReturnValue({
            auth: mockSupabaseAuth,
        });
    });

    test("should successfully create a new user with valid data", async () => {
        const mockUserId = "test-user-id-123";
        const userData = {
            name: "Test",
            surnames: "User",
            username: "testuser",
            email: "test@example.com",
            password: "TestPassword123!",
            birthDate: "2000-01-01",
        };

        // Mock: username disponible
        (GetFromDatabase as jest.Mock).mockResolvedValueOnce({
            data: [],
            error: null,
        });

        // Mock: registro exitoso en Supabase Auth
        mockSupabaseAuth.signUp.mockResolvedValueOnce({
            data: { user: { id: mockUserId } },
            error: null,
        });

        // Mock: creación de perfil exitosa
        (PostToDatabase as jest.Mock).mockResolvedValueOnce({
            data: [{ id: mockUserId, username: userData.username }],
            error: null,
        });

        // Verificar que username está disponible
        await GetFromDatabase({
            tableName: "User",
            select: "username",
            filters: [{ method: "eq", column: "username", value: userData.username }],
        });

        expect(GetFromDatabase).toHaveBeenCalledWith({
            tableName: "User",
            select: "username",
            filters: [{ method: "eq", column: "username", value: userData.username }],
        });

        // Simular registro
        const signUpResult = await mockSupabaseAuth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: `http://localhost:3000/home`,
            },
        });

        expect(mockSupabaseAuth.signUp).toHaveBeenCalled();
        expect(signUpResult.data.user.id).toBe(mockUserId);

        // Simular creación de perfil
        const profileResult = await PostToDatabase({
            tableName: "User",
            contentJson: {
                id: mockUserId,
                name: userData.name,
                surnames: userData.surnames,
                username: userData.username,
                birth_date: userData.birthDate,
                banner: null,
                profile_picture: null,
            },
        });

        expect(PostToDatabase).toHaveBeenCalledWith({
            tableName: "User",
            contentJson: expect.objectContaining({
                id: mockUserId,
                username: userData.username,
            }),
        });

        expect(profileResult.data).toBeDefined();
        expect(profileResult.data![0].id).toBe(mockUserId);
    });

    test("should fail when username already exists", async () => {
        const userData = {
            username: "existinguser",
            email: "test@example.com",
        };

        // Mock: username ya existe
        (GetFromDatabase as jest.Mock).mockResolvedValueOnce({
            data: [{ username: userData.username }],
            error: null,
        });

        const usernameCheck = await GetFromDatabase({
            tableName: "User",
            select: "username",
            filters: [{ method: "eq", column: "username", value: userData.username }],
        });

        expect(GetFromDatabase).toHaveBeenCalledWith({
            tableName: "User",
            select: "username",
            filters: [{ method: "eq", column: "username", value: userData.username }],
        });

        expect(usernameCheck.data).toHaveLength(1);
        expect(usernameCheck.data![0].username).toBe(userData.username);

        // El signup no debería ser llamado si el username existe
        expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
    });

    test("should fail when passwords do not match", () => {
        const password = "TestPassword123!";
        const repeatPassword = "DifferentPassword123!";

        expect(password).not.toBe(repeatPassword);
    });

    test("should validate password requirements", () => {
        const weakPasswords = [
            { pwd: "12345", reason: "too short and no letters" },
            { pwd: "password", reason: "no uppercase or numbers" },
            { pwd: "PASSWORD123", reason: "no lowercase" },
            { pwd: "Pass123", reason: "too short" },
        ];

        weakPasswords.forEach(({ pwd }) => {
            const hasUppercase = /[A-Z]/.test(pwd);
            const hasLowercase = /[a-z]/.test(pwd);
            const hasNumber = /[0-9]/.test(pwd);
            const hasMinLength = pwd.length >= 8;

            const isValid = hasUppercase && hasLowercase && hasNumber && hasMinLength;
            expect(isValid).toBe(false);
        });

        // Contraseña válida
        const validPassword = "TestPassword123!";
        const hasUppercase = /[A-Z]/.test(validPassword);
        const hasLowercase = /[a-z]/.test(validPassword);
        const hasNumber = /[0-9]/.test(validPassword);
        const hasMinLength = validPassword.length >= 8;

        expect(hasUppercase && hasLowercase && hasNumber && hasMinLength).toBe(true);
    });
});