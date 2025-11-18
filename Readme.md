# AI Powered Regex Pattern Generator

A full-stack application that generates regex patterns from natural language descriptions and sample patterns using Google's Gemini AI. Built with React (Vite) frontend and Node.js/Express backend with **LangGraph workflow orchestration**.

## 🚀 Features

- **🤖 AI-Powered Generation** - Uses Google Gemini AI to generate accurate regex patterns
- **🔄 LangGraph Workflow** - Orchestrated pattern generation with security validation
- **💬 Natural Language Processing** - Describe your pattern in plain English
- **📝 Sample-Based Learning** - Provide example patterns to improve accuracy
- **⚡ Real-time Testing** - Test generated regex patterns instantly
- **🔍 Rule Extraction** - See the underlying rules extracted from your description
- **🛡️ Security First** - Built-in REDOS vulnerability detection
- **📱 Responsive Design** - Works perfectly on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - AI model for pattern generation
- **LangGraph** - Workflow orchestration and state management
- **LangChain** - AI integration framework
- **Zod** - Schema validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

## 🚀 Quick Start

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

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**To get your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API key"
4. Create a new API key and copy it to your `.env` file

### 3. Run the Application

Choose between two backend architectures:

#### Option A: LangGraph Workflow (Recommended)
```bash
# Start both frontend and LangGraph backend
npm run graph
```

#### Option B: Traditional LangChain
```bash
# Start both frontend and traditional backend
npm run chain
```

This will start:
- **Backend server** on http://localhost:3000
- **Frontend development server** on http://localhost:3001

The application will automatically open in your browser.

## 📜 Available Scripts

### Backend Scripts
| Command | Description |
|---------|-------------|
| `npm run serverGraph` | Start LangGraph development server with nodemon |
| `npm run serverChain` | Start traditional LangChain development server |
| `npm run client` | Start frontend development server |
| `npm run graph` | Start both LangGraph backend and frontend |
| `npm run chain` | Start both traditional backend and frontend |

### Frontend Scripts (run from `/client` directory)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🏗 Architecture

### LangGraph Workflow
The application features two backend architectures:

1. **LangGraph Workflow** (`serverGraph.js`):
   - Stateful workflow orchestration
   - Sequential rule evaluation and pattern optimization
   - Built-in error handling and validation
   - Graph-based execution with Zod schema validation

2. **Traditional LangChain** (`serverChain.js`):
   - Linear chain execution
   - Simple request-response pattern
   - Direct API integration

### Workflow Steps:
1. **Rule Evaluation** - Analyze input for security risks and extract structural rules
2. **Security Validation** - Detect and prevent REDOS vulnerabilities
3. **Pattern Optimization** - Generate safe, efficient regex patterns
4. **Test Generation** - Create comprehensive validation test cases

## 🎯 How to Use

### 1. Describe Your Pattern
Enter a clear description in the text area  
**Example:** "Match email addresses" or "Validate phone numbers in US format"

### 2. Provide Sample Patterns
Add examples that should match your pattern  
Click "+ Add Another Sample" for multiple examples  
**Examples for emails:** test@example.com, hello@world.io

### 3. Generate Regex Pattern
Click "Generate Regex Pattern" button  
Wait for AI processing (typically 5-10 seconds)

### 4. Test and Validate
Use the test input box to validate the pattern  
See immediate feedback with ✅ or ❌ results  
Review generated rules and explanation

## 📊 Example Usage

**Input:**
- **Description:** "UK NI Number"
- **Samples:** AB123456C, XY987654Z

**Output:**
- **Regex Pattern:** `^[A-Z]{2}[0-9]{6}[A-Z]$`
- **Explanation:** Pattern for UK National Insurance number format
- **Test Cases:** Valid and invalid examples
- **Extracted Rules:** 
  - Starts with 2 uppercase letters
  - Followed by 6 digits
  - Ends with 1 uppercase letter

## 🔧 API Documentation

### POST `/generate-pattern`

Generates regex pattern from description and samples using LangGraph workflow.

**Request Body:**
```json
{
  "description": "UK NI Number",
  "samples": ["AB123456C", "XY987654Z"]
}
```

**Success Response:**
```json
{
  "success": true,
  "rules": [
    {"rule": "Starts with 2 uppercase letters"},
    {"rule": "Followed by 6 digits"},
    {"rule": "Ends with 1 uppercase letter"}
  ],
  "output": {
    "pattern": "^[A-Z]{2}[0-9]{6}[A-Z]$",
    "explanation": "Matches UK National Insurance number format...",
    "tests": {
      "valid": ["AB123456C", "XY987654Z"],
      "invalid": ["AB12345", "123456AB", "AB1234567C"]
    }
  }
}
```

**Error Response:**
```json
{
  "error": "Security risk detected: Pattern complexity could cause performance issues",
  "code": "REDOS_DETECTED"
}
```

## 🛡 Security Features

- **REDOS Detection** - Automatic detection of ReDoS vulnerabilities
- **Safe Pattern Generation** - Only linear-time regex constructions
- **Input Validation** - Comprehensive security checks at multiple stages
- **Error Propagation** - Secure error handling throughout the workflow

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "GEMINI_API_KEY not found" | Ensure `.env` file exists with valid API key |
| Port 3000 already in use | Run `npx kill-port 3000` or change port |
| Port 3001 already in use | Run `npx kill-port 3001` or Vite will auto-select |
| Module not found errors | Run `npm install` in both backend and client |
| LangGraph compilation errors | Check Node.js version (requires v18+) |

### Debug Mode
Check these locations for detailed error information:
- **Backend Console** - Server logs and API processing
- **Browser Console** - Frontend errors and network requests
- **Network Tab** - API call details and responses

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting platform
```

### Backend Deployment (Railway/Render)
1. Set environment variable `GEMINI_API_KEY` in your deployment platform
2. Deploy the backend directory
3. Update frontend API calls to point to your deployed backend URL

### Environment Variables for Production
```env
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
- Check the **Troubleshooting** section above
- Ensure all prerequisites are met
- Verify your Gemini API key is valid and has sufficient quota
- Check the browser console and terminal logs for error details

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use environment variables for all sensitive data in production
- Regular security audits for generated regex patterns

## ✅ Success Checklist

After setup, verify:
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:3001
- ✅ Application accessible at http://localhost:3001
- ✅ API calls to `/generate-pattern` working
- ✅ Regex generation and testing functional
- ✅ Security validation detecting unsafe patterns

## 🏆 Architecture Benefits

**LangGraph Workflow Provides:**
- **State Management** - Built-in state tracking across workflow steps
- **Error Handling** - Robust error propagation and recovery
- **Validation** - Zod schema validation at each step
- **Extensibility** - Easy to add new workflow nodes
- **Monitoring** - Built-in observability and debugging

Happy pattern generating! 🎉

If you find this project helpful, please give it a ⭐ on GitHub!

---

*Built with modern AI orchestration using LangGraph for reliable and secure regex pattern generation.*