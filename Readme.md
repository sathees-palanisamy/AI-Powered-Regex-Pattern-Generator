The issue is likely with the formatting when copying. Here's a clean version without complex formatting:

# AI Powered Regex Pattern Generator

A full-stack application that generates regex patterns from natural language descriptions and sample patterns using Google's Gemini AI. Built with React (Vite) frontend and Node.js/Express backend.

## Features

- **AI-Powered Generation** - Uses Google Gemini AI to generate accurate regex patterns
- **Natural Language Processing** - Describe your pattern in plain English
- **Sample-Based Learning** - Provide example patterns to improve accuracy
- **Real-time Testing** - Test generated regex patterns instantly
- **Rule Extraction** - See the underlying rules extracted from your description
- **Responsive Design** - Works perfectly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 - UI framework
- Vite - Build tool and dev server
- CSS3 - Styling with modern features

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- Google Gemini AI - AI model for pattern generation
- LangChain - AI integration framework

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key (Get it here: https://aistudio.google.com/app/apikey)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd langgraph-regex-backend

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**To get your Gemini API Key:**
1. Visit Google AI Studio: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Get API key"
4. Create a new API key and copy it to your `.env` file

### 3. Run the Application

```bash
# Start both frontend and backend simultaneously
npm run dev
```

This command will start:
- Backend server on http://localhost:3000
- Frontend development server on http://localhost:3001

The application will automatically open in your browser.

## Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run server` - Start development server with nodemon
- `npm run client` - Start frontend development server
- `npm run dev` - Start both servers simultaneously

### Frontend Scripts (run from `/client` directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How to Use

1. **Describe Your Pattern** - Enter a clear description in the text area
   Example: "Match email addresses" or "Validate phone numbers in US format"

2. **Provide Sample Patterns** - Add examples that should match your pattern
   Click "+ Add Another Sample" for multiple examples
   Examples for emails: test@example.com, hello@world.io

3. **Generate Regex Pattern** - Click "Generate Regex Pattern" button
   Wait for AI processing (typically 5-10 seconds)

4. **Test and Validate** - Use the test input box to validate the pattern
   See immediate feedback with checkmarks or cross marks
   Review generated rules and explanation

## Example Usage

**Input:**
- Description: "Match email addresses"
- Samples: test@example.com, hello@world.io, user.name+tag@domain.co.uk

**Output:**
- Regex Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- Explanation: Pattern for standard email format validation
- Test Cases: Valid and invalid examples
- Extracted Rules: Rules discovered from your samples

## API Documentation

### POST `/generate-pattern`

Generates regex pattern from description and samples.

**Request Body:**
```json
{
  "description": "UK NI Number",
  "samples": []
}
```

**Success Response:**
```json
{
  "success": true,
  "rules": [
    {"rule": "Starts with 2 letters."},
    {"rule": "Followed by 6 digits."},
    {"rule": "Ends with 1 letter."}
  ],
  "output": {
    "pattern": "^[a-zA-Z]{2}[0-9]{6}[a-zA-Z]$",
    "explanation": "The pattern enforces the following rules...",
    "tests": {
      "valid": ["AB123456C", "xy987654z"],
      "invalid": ["A123456B", "ABC123456", "AB123456"]
    }
  }
}
```

**Error Response:**
```json
{
  "error": "Missing required fields: description and samples"
}
```

## Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "GEMINI_API_KEY not found" | Ensure .env file exists in backend directory with valid API key |
| Port 3000 already in use | Run `npx kill-port 3000` or change port in server.js |
| Port 3001 already in use | Run `npx kill-port 3001` or Vite will automatically use next available |
| Module not found errors | Run `npm install` in both backend and client directories |
| CORS errors | Backend includes CORS headers for development on localhost:3001 |

### Debug Mode
Check these locations for detailed error information:
- Backend Console - Server logs and API processing
- Browser Console - Frontend errors and network requests
- Network Tab - API call details and responses

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting platform
```

### Backend Deployment (Railway/Render)
1. Set environment variable GEMINI_API_KEY in your deployment platform
2. Deploy the backend directory
3. Update frontend API calls to point to your deployed backend URL

### Environment Variables for Production
```
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues:
- Check the Troubleshooting section above
- Ensure all prerequisites are met
- Verify your Gemini API key is valid and has sufficient quota
- Check the browser console and terminal logs for error details

## Security Notes

- Never commit your .env file to version control
- Add .env to your .gitignore file
- Use environment variables for all sensitive data in production

## Success Checklist

After setup, verify:
- Backend running on http://localhost:3000
- Frontend running on http://localhost:3001
- Application accessible at http://localhost:3001
- API calls to /generate-pattern working
- Regex generation and testing functional

Happy pattern generating!

If you find this project helpful, please give it a star on GitHub!

---

**Copy this plain text version instead** - it should work without any formatting issues when pasted into your README.md file.
