module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react)/)",
    "/node_modules/(?!date-fns)/",
     "/node_modules/(?!msw)/"
  ],
  "setupFilesAfterEnv": [
      "<rootDir>/src/setupTests.js"
    ],
  moduleFileExtensions: ["js", "jsx", "json", "node"],  // Correction ici
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"


  },
  
  testEnvironment: "jsdom"
};
