import React from "react";
import { WindowProps } from "./types";

export default function VSCodeWindow({
  windowId,
  position,
  isDragging,
  onMouseDown,
  onClose,
}: WindowProps) {
  return (
    <div
      className={`app-window show ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={(e) => onMouseDown(e, windowId)}>
      <div className="app-window-header">
        <i className="bx bx-question-mark"></i>NASA source code(?)
        <button
          onClick={onClose}
          className="app-window-close-button">
          ×
        </button>
      </div>
      <div className="app-window-body">
        <pre className="line-numbers">
          <code className="language-python">{`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from transformers import *
from googletrans import Translator


app = FastAPI()
ideal_steps = 10000
# Recommendation
recommendation_first = []
recommendation_second = []



#CORS

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=['*']
)


@app.get("/get_recommendation")
async def get_reccomendation():
    if len(recommendation_first) == 0:
        recommendation = recommendation_second[random.randint(0, len(recommendation_second) - 1)]
    else:
        recommendation = recommendation_first[random.randint(0, len(recommendation_first) - 1)]
    rec = recommendation
    return {"recommendation": rec}


@app.get("/test")
async def get_test():
    return{"Arseniy": "Debil"}



@app.get("/get_daily_info")
async def get_daily_info():
    return {
    "weight":status_weight, 
    "calories":status_calories,
    "water":status_water, 
    "sleep":status_sleep,
    "steps":status_steps
    }

@app.get("/get_person_info")
async def get_person_info():
    return {
    "weight":ideal_weight,
    "calories":ideal_calories,
    "sleep":ideal_sleep,
    "steps":ideal_steps,
    "water":ideal_water
    }`}</code>
        </pre>
      </div>
    </div>
  );
}
