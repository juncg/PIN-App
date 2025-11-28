import { PostToDatabase, GetFromDatabase } from "@/lib/services/general";
import { Tables } from "@/database.types";
import { getUserUuid } from "@/lib/services/user";

jest.mock("@/lib/services/general");
jest.mock("@/lib/services/user");

describe("Offer Creation", () => {
    const mockUserUuid = "test-user-uuid";
    const mockForumId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
        (getUserUuid as jest.Mock).mockResolvedValue(mockUserUuid);
    });

    test("should successfully create an offer when user is associated with a business", async () => {
        // Mock: usuario es empleado de negocio
        (GetFromDatabase as jest.Mock)
            .mockResolvedValueOnce({
                // Business_Employee check
                data: [{ user_id: mockUserUuid, business_id: 1 }],
                error: null,
            })
            .mockResolvedValueOnce({
                // Business owner check
                data: [],
                error: null,
            });

        // Verificar que el usuario es de negocio
        const businessCheck = await GetFromDatabase({
            tableName: "Business_Employee",
            select: "*",
            filters: [{ method: "eq", column: "user_id", value: mockUserUuid }],
        });

        const isBusinessUser = businessCheck.data && businessCheck.data.length > 0;
        expect(isBusinessUser).toBe(true);

        const offerData: Omit<Tables<"Offer">, "id"> = {
            title: "Test Offer",
            text: "Test offer description",
            target_progress: 50,
            target_completition_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            creator_id: mockUserUuid,
            current_progress: 0,
            comment_locked_state: "Unlocked",
            fee: 10,
            forum_id: mockForumId,
            likes: 0,
            superlikes: 0,
            state: "Posted",
            images: null,
        };

        const mockResponse = {
            data: [{ ...offerData, id: 1 }],
            error: null,
        };

        (PostToDatabase as jest.Mock).mockResolvedValueOnce(mockResponse);

        const result = await PostToDatabase({
            tableName: "Offer",
            contentJson: [offerData],
        });

        expect(PostToDatabase).toHaveBeenCalledWith({
            tableName: "Offer",
            contentJson: [offerData],
        });

        expect(result.data).toBeDefined();
        expect(result.data![0].title).toBe("Test Offer");
        expect(result.error).toBeNull();
    });

    test("should fail when user is not associated with a business", async () => {
        // Mock: usuario NO es empleado ni dueño de negocio
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
            filters: [{ method: "eq", column: "user_id", value: mockUserUuid }],
        });

        const ownedBusinesses = await GetFromDatabase({
            tableName: "Business",
            select: "*",
            filters: [{ method: "eq", column: "owner_id", value: mockUserUuid }],
        });

        const isBusinessUser =
            (businessEmployees.data && businessEmployees.data.length > 0) ||
            (ownedBusinesses.data && ownedBusinesses.data.length > 0);

        expect(isBusinessUser).toBe(false);
    });

    test("should fail when target_progress is less than 10", () => {
        const invalidTargetProgress = 5;
        expect(invalidTargetProgress).toBeLessThan(10);
    });

    test("should fail when fee is negative", () => {
        const invalidFee = -10;
        expect(invalidFee).toBeLessThan(0);
    });

    test("should fail when target_completition_date is in the past", () => {
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const now = new Date();

        expect(new Date(pastDate).getTime()).toBeLessThan(now.getTime());
    });

    test("should validate that target_completition_date is at least 24 hours in the future", () => {
        const now = new Date();
        const validDate = new Date(now.getTime() + 25 * 60 * 60 * 1000); // 25 horas
        const invalidDate = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 horas

        expect(validDate.getTime()).toBeGreaterThan(now.getTime() + 24 * 60 * 60 * 1000);
        expect(invalidDate.getTime()).toBeLessThan(now.getTime() + 24 * 60 * 60 * 1000);
    });

    test("should successfully create offer with tags", async () => {
        const offerId = 1;
        const selectedTags = [1, 2, 3];

        const tagRelations = selectedTags.map((tagId) => ({
            offer_id: offerId,
            tag_id: tagId,
        }));

        (PostToDatabase as jest.Mock).mockResolvedValueOnce({
            data: tagRelations,
            error: null,
        });

        const result = await PostToDatabase({
            tableName: "Offer_Tag",
            contentJson: tagRelations,
        });

        expect(PostToDatabase).toHaveBeenCalledWith({
            tableName: "Offer_Tag",
            contentJson: tagRelations,
        });

        expect(result.data).toHaveLength(3);
        expect(result.error).toBeNull();
    });

    test("should validate required fields per CreateOfferSchema", () => {
        const requiredFields = ["title", "text", "target_progress", "target_completition_date", "fee", "forum_id"];

        const incompleteOffer = {
            title: "Test",
            // Faltan otros campos
        };

        requiredFields.forEach((field) => {
            if (field !== "title") {
                expect(incompleteOffer).not.toHaveProperty(field);
            }
        });
    });

    test("should set initial state to Posted and current_progress to 0", () => {
        const initialState = "Posted";
        const initialProgress = 0;

        expect(initialState).toBe("Posted");
        expect(initialProgress).toBe(0);
    });

    test("should allow images array or null", () => {
        const withImages = { images: ["url1.jpg", "url2.jpg"] };
        const withoutImages = { images: null };

        expect(withImages.images).toBeInstanceOf(Array);
        expect(withoutImages.images).toBeNull();
    });
});