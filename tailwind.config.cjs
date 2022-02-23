// const { "[data-theme=dark]": darkTheme, 
// "[data-theme=light]": lightTheme} = require("daisyui/src/colors/themes");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  daisyui: {
    styled: true,
    themes: [
      // Generated from https://themes.ionevolve.com/
      "divbloxLight",
      "divbloxDark",
      {
        divbloxLight: {
           "primary" : "#7639FF",
           "primary-focus" : "#5C29CE",
           "primary-content" : "#ffffff",
           "secondary" : "#A32BBA",
           "secondary-focus" : "#841E98",
           "secondary-content" : "#ffffff",
           "accent" : "#c1d6e1",
           "accent-focus" : "#a6c1cf",
           "accent-content" : "#292A39",
           "neutral" : "#36384A",
           "neutral-focus" : "#1E1D2C",
           "neutral-content" : "#ffffff",
           "base-100" : "#ffffff",
           "base-200" : "#EFF0F8",
           "base-300" : "#DFE2EF",
           "base-content" : "#292A39",
           "info" : "#C0D5E0",
           "success" : "#68DBB3",
           "warning" : "#ff9900",
           "error" : "#FF1717",
           "--rounded-box": "0.5rem",          
           "--rounded-btn": "0.5rem",        
           "--rounded-badge": "0.8rem",      
           "--animation-btn": "0.10s",       
           "--animation-input": "0.2s",       
           "--btn-text-case": "uppercase",   
           "--navbar-padding": "0.5rem",      
           "--border-btn": "1px"               
        }
      },
      {
        divbloxDark: {
          "primary" : "#793ef9",
          "primary-focus" : "#5C29CE",
          "primary-content" : "#ffffff",
          "secondary" : "#A32BBA",
          "secondary-focus" : "#841E98",
          "secondary-content" : "#ffffff",
          "accent" : "#9ab5c3",
          "accent-focus" : "#7e9aa9",
          "accent-content" : "#292A39",
          "neutral" : "#22262f",
          "neutral-focus" : "#14161a",
          "neutral-content" : "#ffffff",
          "base-100" : "#454758",
          "base-200" : "#2a2e37",
          "base-300" : "#16181d",
          "base-content" : "#ffffff",
          "info" : "#C0D5E0",
          "success" : "#68DBB3",
          "warning" : "#FDD16A",
          "error" : "#FF1717",
         "--rounded-box": "0.5rem",          
         "--rounded-btn": "0.5rem",        
         "--rounded-badge": "0.8rem",      
         "--animation-btn": "0.10s",       
         "--animation-input": "0.2s",       
         "--btn-text-case": "uppercase",   
         "--navbar-padding": "0.5rem",      
         "--border-btn": "1px"         
        }
      }
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "divbloxDark",
  }
}