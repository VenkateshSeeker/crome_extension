from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.graph import graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryInput(BaseModel):
    query: str


@app.get("/ping")
def ping_server():
    return {"status": "alive"}


@app.post("/extract_filters")
def extract_filters_api(input_data: QueryInput):

    result = graph.invoke(
        {"query": input_data.query}
    )

    return result
