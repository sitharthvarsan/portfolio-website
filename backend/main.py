from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import time
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

app = Flask(__name__)
# Change this line in app.py
CORS(app, resources={r"/ask": {"origins": ["https://portfolio-frontend-xq12.onrender.com"]}})
# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# --- MODIFIED FUNCTION ---
# Now accepts a 'config' dictionary for API parameters
def get_ai_response(prompt, config):
    """Handle Gemini API calls with rate limit retry logic"""
    try:
        # Pass the generation_config to the model
        response = model.generate_content(prompt, generation_config=config)
        return response.text
    except Exception as e:
        if "429" in str(e):  # Rate limit error
            time.sleep(60)
            return get_ai_response(prompt, config)  # Retry with config
        raise  # Re-raise other errors

@app.route('/ask', methods=['POST'])
def ask():
    try:
        # Validate input
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({"error": "Missing 'question' in request"}), 400
        
        question = data['question'].strip()
        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400

        # Load profile
        try:
            with open("profile.txt", "r", encoding='utf-8') as f:
                profile_data = f.read()
        except FileNotFoundError:
            return jsonify({"error": "profile.txt not found"}), 500

        # --- 1. IMPROVED PROMPT ---
        # More specific instructions for concise answers.
        prompt = f"""You are a professional AI assistant for Sitharth Varsan's portfolio. 
Your goal is to be concise and direct. Keep all answers under 4 sentences. 
Do not use conversational fillers. Focus only on the key information.
If the answer isn't in the profile, say "I don't have that information."

PROFILE:
{profile_data}

QUESTION: {question}"""

        # --- 2. ADDED GENERATION CONFIG ---
        # This controls the "creativity" and length of the response.
        generation_config = {
            "temperature": 0.2,          # Lower temperature for more focused answers
            "max_output_tokens": 150,    # Hard limit on response length
        }

        # Get AI response, passing the new config
        answer = get_ai_response(prompt, generation_config)
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "api_key_configured": bool(API_KEY),
        "profile_exists": os.path.exists("profile.txt"),
        "model": "gemini-1.5-flash"
    })

if __name__ == '__main__':
    app.run(port=8000, debug=True)