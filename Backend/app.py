from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os,uvicorn
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

# ------------------------
# Config
# ------------------------
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app = FastAPI()

origins = [
    "https://street-fix.vercel.app",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # --- Category check via Gemini
    topic_flag = check_with_gemini(file_path, category)

    response = {
        "filename": file.filename,
        "topic_related": topic_flag
    }
    print(response)
    return JSONResponse(content=response)

# ------------------------
# Run
# ------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
