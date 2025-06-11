# Claude ROI Calculator

A powerful tool that helps companies identify AI implementation opportunities with Claude and calculate their return on investment. Built with real-world case studies from 120+ companies.

🔗 **Live Demo**: [clauderoicalculator.com](https://clauderoicalculator.com) (coming soon)

## Features

- 🤖 **AI-Powered Analysis**: Uses Claude to analyze your company and identify relevant use cases
- 💰 **ROI Calculations**: Calculate potential savings based on your specific employee roles and salaries
- 📊 **Real Case Studies**: Browse 120+ real implementations from companies like Notion, GitLab, and more
- 🌍 **Geographic Adjustments**: Automatic salary adjustments based on company location
- 🎯 **Role-Specific Recommendations**: Get tailored suggestions for each business function

## Tech Stack

- **Backend**: Python/Flask + Claude API
- **Frontend**: Next.js + Tailwind CSS
- **AI**: Anthropic Claude (Sonnet 4)
- **Deployment**: Vercel (frontend) + Render/Railway (backend)

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your ANTHROPIC_API_KEY
python app.py
```

### Frontend Setup
```bash
cd frontend-next
npm install  # or yarn/bun install
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=your_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Render/Railway)
- Connect your GitHub repo
- Set environment variables
- Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a PR.

## License

MIT License - see LICENSE file for details.

## Credits

Built by [Luka Kalajžić](https://lukakalajzic.com) with Claude.

Data sourced from [Anthropic's case studies](https://anthropic.com/customers).