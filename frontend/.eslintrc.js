module.exports = {
  "plugins": ["prettier"],
  extends: [
    "plugin:prettier/recommended",
    "prettier",
    "prettier/react",
    "react-app",
    "react-app/jest",
  ],
  "rules": { "react/jsx-props-no-spreading": "off", "react/require-default-props": "off", "react/forbid-prop-types": "off" , "prettier/prettier": "warn" }
};
