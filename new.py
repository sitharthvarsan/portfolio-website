import google.generativeai as genai
import os, time
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')  # Higher free quota

def get_ai_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        if "429" in str(e):
            time.sleep(60)  # Wait 1 minute if rate limited
            return get_ai_response(prompt)
        return f"Error: {str(e)}"

print(get_ai_response("Explain quantum computing simply"))