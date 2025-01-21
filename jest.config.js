module.exports = {
  transform: {
        "^.+\\.[tj]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react)/)",
    "/node_modules/(?!date-fns)/",
     "/node_modules/(?!msw)/",
     "/node_modules/(?!(@bundled-es-modules)/)",
     "/node_modules/(?!(react-leaflet|leaflet|@react-leaflet|leaflet-routing-machine)/)", 


  ],
  "setupFilesAfterEnv": [
      "<rootDir>/src/setupTests.js"
    ],
  moduleFileExtensions: ["js", "jsx", "json", "node"],  // Correction ici
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"


  },
  
  testEnvironment: "jsdom"
};
