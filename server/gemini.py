import base64
import os
from google import genai
from google.genai import types

import asyncio

def ensure_event_loop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop

def generate(degree_title, missing_earnings):
    loop = ensure_event_loop()

    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""You will receive an input in the following format:
                [Bachelor's Degree Name], [earnings metric(s)]

                For example:

                \"Computer Science, 1 year median earnings\"
                \"Mechanical Engineering, 1 year median earnings, 2 year median earnings\"

                Based on this input, please return current and reliable numerical median earnings data for the specified degree. If data is available for both 1-year and 2-year median earnings, include both values. If only one metric is available, return just that one."""),
                types.Part.from_text(text=f"""{degree_title}, {missing_earnings}"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.15,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            required = ["response"],
            properties = {
                "response": genai.types.Schema(
                    type = genai.types.Type.OBJECT,
                    properties = {
                        "1_year_median_earnings": genai.types.Schema(
                            type = genai.types.Type.NUMBER,
                        ),
                        "2_year_median_earnings": genai.types.Schema(
                            type = genai.types.Type.NUMBER,
                        ),
                    },
                ),
            },
        ),
        system_instruction=[
            types.Part.from_text(text="""You are a quick and accurate machine that provides responses in JSON format. You will receive information and you will output the most updated, accurate and reliable information."""),
        ],
    )

    response_data = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response_data += chunk.text

    return response_data

if __name__ == "__main__":
    generate()