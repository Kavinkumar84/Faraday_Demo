# How to Run the Application

This project consists of a Next.js frontend and a Python Flask backend.

## Prerequisites

- Node.js installed
- Python installed
- `npm` or `yarn` installed

## Steps to Run

1.  **Start the Backend Server (Flask)**

    Open a terminal and run:

    ```bash
    cd faraday_backend
    # Activate virtual environment
    .\venv\Scripts\activate
    # Install dependencies (if not already done)
    pip install -r requirements.txt
    # Run server
    python app.py
    ```

    The backend will start at `http://localhost:5000`.

2.  **Start the Frontend Server (Next.js)**

    Open a separate terminal and run:

    ```bash
    cd faraday_frontend
    # Install dependencies (if not already done)
    npm install
    # Run development server
    npm run dev
    ```

    The frontend will start at `http://localhost:3000`.

3.  **Use the Application**

    Open your browser and navigate to `http://localhost:3000`.
    - You will see the "Verify Human" page.
    - Complete the Turnstile challenge.
    - If your country is detected (via Cloudflare headers), you will be redirected automatically (e.g., to `/in`, `/ae`, or `/us`).
    - If country detection fails (common on localhost), a "Select Your Region" popup will appear.
    - Select your country to proceed.

## Configuration

- **Frontend Environment Variables**: Located in `faraday_frontend/.env.local`.
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `NEXT_PUBLIC_BACKEND_URL`

- **Backend Environment Variables**: Located in `faraday_backend/.env`.
  - `TURNSTILE_SECRET_KEY`

## Notes

- The backend uses `flask-cors` to allow requests from the frontend during development.
- Cloudflare checking relies on `CF-IPCountry` header which is only present when deployed behind Cloudflare. On localhost, the fallback modal will always appear unless you mock the header.
