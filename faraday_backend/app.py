from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

TURNSTILE_SECRET_KEY = os.getenv('TURNSTILE_SECRET_KEY')

@app.route('/verify-turnstile', methods=['POST'])
def verify_turnstile():
    token = request.json.get('token')
    frontend_country = request.json.get('country')
    frontend_ip = request.json.get('ip')
    server_ip = request.remote_addr
    
    print(f"Received from frontend - Country: {frontend_country}, IP: {frontend_ip}")
    print(f"Server sees client IP as: {server_ip}")
    
    # Cloudflare Turnstile verification
    url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    payload = {
        'secret': TURNSTILE_SECRET_KEY,
        'response': token,
        'remoteip': server_ip
    }
    
    print(f"Verifying Turnstile token...")
    
    try:
        response = requests.post(url, data=payload)
        result = response.json()
        
        if result.get('success'):
            print("Turnstile verification successful")
            
            # Prefer frontend-detected country (uses VPN) over server-detected
            country = frontend_country
            public_ip = frontend_ip
            
            # Fallback: Try to get country from Cloudflare headers
            if not country:
                country = request.headers.get('CF-IPCountry')
                print(f"CF-IPCountry header: {country}")
            
            # Fallback: Server-side GeoIP lookup (won't use VPN)
            if not country:
                print("No frontend country. Attempting server-side GeoIP lookup...")
                try:
                    ip_response = requests.get('http://ip-api.com/json/')
                    if ip_response.status_code == 200:
                        ip_data = ip_response.json()
                        print(f"Full GeoIP response: {ip_data}")
                        country = ip_data.get('countryCode')
                        public_ip = ip_data.get('query')
                        print(f"Server-side GeoIP detected IP: {public_ip}")
                        print(f"Server-side GeoIP detected country: {country}")
                    else:
                        print(f"GeoIP lookup failed with status: {ip_response.status_code}")
                except Exception as geo_e:
                    print(f"GeoIP lookup error: {str(geo_e)}")

            print(f"Final country for response: {country}, IP: {public_ip}")
            return jsonify({
                'success': True, 
                'country': country, 
                'ip': public_ip
            })
        else:
            print(f"Turnstile verification failed: {result.get('error-codes')}")
            return jsonify({'success': False, 'error': result.get('error-codes')}), 400
            
    except Exception as e:
        print(f"Verification error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
