test('hello world!', () => {
	expect(1 + 1).toBe(2);
});

// jest.config.js
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>"],
    testMatch: [
        "**/__tests__/**/*.test.ts?(x)",
        "**/__tests__/**/*.test.js?(x)",
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "/tests/", // Ignore Playwright tests
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    collectCoverageFrom: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "lib/**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
        "!**/.next/**",
    ],
};