import os, asyncio
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv(override=True)
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-flash-latest')

async def main():
    img = Image.new('RGB', (1, 1))
    print('Generating...')
    r = await model.generate_content_async(['Hello', img])
    print(r.text)

asyncio.run(main())
