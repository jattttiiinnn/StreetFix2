from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from transformers import pipeline
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv


load_dotenv('../.env.local')

# ------------------------
# Config
# ------------------------
# 🔑 Replace with your Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# FastAPI app
app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------
# Models
# ------------------------

realism_model = pipeline("image-classification", model="google/vit-base-patch16-224")
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# ------------------------
# Gemini Category Checker
# ------------------------
def check_with_gemini(image_path, category: str) -> bool:
    img = Image.open(image_path)

    prompt = f"Does this image contain a {category}? Answer strictly with 'yes' or 'no'."

    response = gemini_model.generate_content([prompt, img])
    answer = (response.text or "").strip().lower()
    return answer == "yes"

# ------------------------
# Upload Endpoint
# ------------------------
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), category: str = Form(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())



    # --- Realism check
    img = Image.open(file_path)
    predictions = realism_model(img)
    realism_flag = max([p["score"] for p in predictions]) > 0.2

    # --- Category check via Gemini
    topic_flag = check_with_gemini(file_path, category)

    # Final response
    response = {
        "filename": file.filename,
        "topic_related": topic_flag,
        "real_image": realism_flag,
        "confidence": max([p["score"] for p in predictions]) if predictions else 0
    }
    print(response)
    return JSONResponse(content=response)

# ------------------------
# Run
# ------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render sets $PORT
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
