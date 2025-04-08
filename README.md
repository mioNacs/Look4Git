# GitSight

A modern GitHub profile analyzer that provides detailed insights into your coding activity, contributions, and repository statistics. Built with React, Vite, and Tailwind CSS.

![GitSight Screenshot](public/screenshot.png)

## ✨ Features

- **Comprehensive Profile Analysis**: View detailed statistics about your GitHub profile
- **Contribution Visualization**: Interactive calendar and line chart views of your contribution history
- **Language Distribution**: Visual breakdown of programming languages used across your repositories
- **Repository Insights**: Detailed analysis of your repositories including stars, forks, and activity
- **Dark Mode Support**: Beautiful dark and light themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub Personal Access Token (for enhanced API access)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mioNacs/Look4Git.git
   cd Look4Git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your GitHub token:
   ```
   VITE_GITHUB_TOKEN=your_github_token_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Deployment

To deploy the application to GitHub Pages:

1. Make sure your `.env.production` file has an empty token value:
   ```
   VITE_GITHUB_TOKEN=
   ```

2. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

4. After deployment, you'll need to manually add your GitHub token in the GitHub Pages environment:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Environment variables", add a new variable:
     - Name: `VITE_GITHUB_TOKEN`
     - Value: Your GitHub Personal Access Token
   - Click "Save"

The application will be available at: [https://mioNacs.github.io/Look4Git/](https://mioNacs.github.io/Look4Git/)

## 🛠️ Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - React charting library
- [GitHub API](https://docs.github.com/en/rest) - GitHub's REST and GraphQL APIs

## 📦 Project Structure

```
gitsight/
├── src/
│   ├── components/     # React components
│   ├── utils/         # Utility functions and API calls
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Static assets
├── .env               # Environment variables
└── package.json       # Project dependencies
```

## 🔧 Configuration

The application can be configured through environment variables:

- `VITE_GITHUB_TOKEN`: Your GitHub Personal Access Token (required for enhanced API access)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing the data
- [Recharts](https://recharts.org/) for the beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for the amazing styling framework

## 📞 Contact

Project Link: [https://github.com/mioNacs/Look4Git](https://github.com/mioNacs/Look4Git)
