module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
  // detectOpenHandles: false,
  // forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
