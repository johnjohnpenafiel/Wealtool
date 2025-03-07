#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import math
from gemini import generate  # Import the generate function

app = Flask(__name__)

CORS(app)

API_KEY = os.getenv("COLLEGEBOARD_API_KEY")
PER_PAGE = 100
BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools"

@app.route("/")
def index():
    return "Wealtool API"

@app.route("/fetch-schools", methods=["GET"])
def fetch_schools():
    state_code = request.args.get("stateCode")

    if not state_code:
        return jsonify({"error": "State code is required"}), 400

    params = {
        "api_key": API_KEY,
        "school.state": state_code,
        "fields": "id,school.name",
        "per_page": PER_PAGE,
        "page": 0
    }

    try:
        initial_response = requests.get(BASE_URL, params=params)
        initial_data = initial_response.json()

        if "error" in initial_data:
            return jsonify({"error": initial_data["error"]}), 400

        total = initial_data["metadata"]["total"]
        total_pages = math.ceil(total / PER_PAGE)

        all_schools = [
            {"id": school["id"], "name": school["school.name"]}
            for school in initial_data.get("results", [])
        ]

        if total_pages > 1:
            for page in range(1, total_pages):
                params["page"] = page
                response = requests.get(BASE_URL, params=params)
                data = response.json()
                all_schools.extend(
                    {"id": school["id"], "name": school["school.name"]}
                    for school in data.get("results", [])
                )

        return jsonify(all_schools)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/fetch-school", methods=["GET"])
def fetch_school():
    school_id = request.args.get("school_id")

    if not school_id:
        return jsonify({"error": "School ID is required"}), 400

    params = {
        "api_key": API_KEY,
        "id": school_id,
        "fields": "id,school.name,school.city,school.state,school.school_url,"
                  "latest.student.size,latest.cost.tuition.in_state,"
                  "latest.cost.tuition.out_of_state,latest.aid.median_debt.completers.overall,"
                  "latest.academics.program_available.bachelor,"
                  "latest.earnings.10_yrs_after_entry.median,"
                  "latest.programs.cip_4_digit.code,latest.programs.cip_4_digit.title",
        "latest.programs.cip_4_digit.credential.level": 3
    }

    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()

        if "error" in data:
            return jsonify({"error": data["error"]}), 400

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/fetch-program", methods=["GET"])
def fetch_program():
    school_id = request.args.get("school_id")
    program_code = request.args.get("program_code")
    
    if not school_id or not program_code:
        return jsonify({"error": "Both school_id and program_code are required"}), 400

    params = {
        "api_key": API_KEY,
        "id": school_id,
        "latest.programs.cip_4_digit.code": program_code,
        "latest.programs.cip_4_digit.credential.level": 3,
        "fields": "latest.programs.cip_4_digit.unit_id,"
                  "latest.programs.cip_4_digit.code,"
                  "latest.programs.cip_4_digit.title,"
                  "latest.programs.cip_4_digit.earnings.highest.1_yr.overall_median_earnings,"
                  "latest.programs.cip_4_digit.earnings.highest.2_yr.overall_median_earnings"
    }

    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()

        if "error" in data:
            return jsonify({"error": data["error"]}), 400

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-earnings", methods=["GET"])
def generate_earnings():
    degree_title = request.args.get("degree_title")
    missing_earnings = request.args.get("missing_earnings")

    if not degree_title or not missing_earnings:
        return jsonify({"error": "Both degree_title and missing_earnings are required"}), 400

    try:
        # Call the generate function from gemini.py
        generated_data = generate(degree_title, missing_earnings)
        
        # Assuming generate function returns JSON data
        return jsonify(generated_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == "__main__":
    app.run(port=5000, debug=True)