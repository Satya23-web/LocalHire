# LocalHire

A Django web platform that connects people with local service providers. Users can find services, book them, chat with providers, make payments, and get help from an AI chatbot.

## Features

- **User accounts**: sign up, login, and authentication (django-allauth)
- **Services**: browse and list local services
- **Bookings**: book and manage service appointments
- **Messaging**: chat between customers and providers
- **Payments**: handle booking payments
- **Notifications**: updates about bookings and messages
- **AI chatbot**: OpenAI-powered assistant to help users on the platform

## Tech Stack

- **Backend:** Python, Django, Django REST Framework
- **AI:** OpenAI API (gpt-4o-mini)
- **Auth:** django-allauth
- **Database:** SQLite (development)
- **Frontend:** HTML, CSS, JavaScript (Django templates)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Satya23-web/LocalHire.git
cd LocalHire
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file inside the `localhire/` folder (next to `manage.py`):

```
SECRET_KEY=your-django-secret-key
DEBUG=True
OPENAI_API_KEY=your-openai-api-key
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

### 5. Run migrations and start the server

```bash
cd localhire
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open http://127.0.0.1:8000/ in your browser.

## Project Structure

```
LocalHire/
└── localhire/
    ├── accounts/        # user authentication and profiles
    ├── bookings/        # service bookings
    ├── chatbot/         # OpenAI chatbot
    ├── messaging/       # user-to-user chat
    ├── notifications/   # alerts and updates
    ├── payments/        # payment handling
    ├── services/        # service listings
    ├── static/          # CSS, JS, images
    ├── template/        # HTML templates
    └── localhire/       # project settings and URLs
```

## Author

**Satya** · [GitHub](https://github.com/Satya23-web)

## License

This project is for learning and portfolio purposes.
