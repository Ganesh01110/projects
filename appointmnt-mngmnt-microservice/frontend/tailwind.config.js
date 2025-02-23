/** @type {import('tailwindcss').Config} */
export default module= {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    } ,
    daisyui: {
      themes: [false],
    },
    plugins: [
      require('daisyui')
    ]
   
  }
  
  
  