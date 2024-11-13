from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from summarize import generate_response, analyze_sentiment, check_guidelines, wrap, recommendation, \
                       follow_up, get_case_id

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Customizations(BaseModel):
    customInstructions: Optional [str] = None
    profile: Optional[str] = None
    summaryLength: Optional[str] = None

class SummaryData(BaseModel):
    user_input: str
    customisations: Optional[Customizations] = {}



@app.get("/")
def health_check():
    return {"health_check": "Status_OK"}


@app.post("/sentiment_analysis")
def sentiment_analysis(request: SummaryData):
    customized_params = request.customisations
    return analyze_sentiment(str(request.user_input), str(customized_params.customInstructions))


@app.post("/follow_up")
def actionable_follow_up(request: SummaryData):
    customized_params = request.customisations
    return follow_up(str(request.user_input), str(customized_params.customInstructions))


@app.post("/recommendation")
def get_recommendation(request: SummaryData):
    customized_params = request.customisations
    return recommendation(str(request.user_input), str(customized_params.customInstructions))

@app.post("/caseid")
def caseid(request: SummaryData):
    customized_params = request.customisations
    return get_case_id(str(request.user_input), str(customized_params.customInstructions))

@app.post("/guidelines")
def guidelines(request: SummaryData):
    customized_params = request.customisations
    return check_guidelines(str(request.user_input), str(customized_params.customInstructions))

@app.post("/wrap_topic")
def wrap_topic(request: SummaryData):
    customized_params = request.customisations
    return wrap(str(request.user_input), str(customized_params.customInstructions))

@app.post("/generate_summary")
def generate_summary(request: SummaryData):
    customized_params = request.customisations
    length = "30" if str(customized_params.summaryLength).lower() == "long" else "10"
    response = generate_response(str(request.user_input), str(customized_params.profile), length, str(customized_params.customInstructions))
    return StreamingResponse(response, media_type="text/event-stream")
    # return { "summary": response }
