module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js", 'jest-allure/dist/setup', './lib/utils/jest-extend.ts'],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  rootDir: ".",
};