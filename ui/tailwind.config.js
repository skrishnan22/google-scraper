/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,saas,ts}",
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'scss-loader',
        ],
      },
    ],
  },
}

