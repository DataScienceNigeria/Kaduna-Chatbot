from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from sql_agent.agent import create_agent
import unidecode
from uuid import uuid4
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Create the agent
agent = create_agent()

# In-memory chat history store (replace with a database for production)
chat_history = {}

class QueryRequest(BaseModel):
    query: str
    session_id: str | None

class ResetRequest(BaseModel):
    session_id: str

@app.post("/query")
async def query(request: QueryRequest):
    if not request.session_id:
        request.session_id = str(uuid4())
        #chat_history[request.session_id] = []
    
    input_text = unidecode.unidecode(request.query)
    # chat_history[request.session_id].append({'role': 'user', 'text': input_text})
    
    response = agent.run({"input": input_text})
    # chat_history[request.session_id].append({'role': 'assistant', 'text': response})
    
    return {
        "response": response,
        "session_id": request.session_id,
        # "chat_history": chat_history[request.session_id]
    }

@app.post("/reset")
async def reset(request: ResetRequest):
    if request.session_id in chat_history:
        del chat_history[request.session_id]
        return {"message": "Chat history reset"}
    else:
        return {"error": "Invalid session ID"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)