import base64
import os
from google import genai
from google.genai import types


def generate():
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
                \"Mechanical Engineering, 1 year and 2 year median earnings\"

                Based on this input, please return only the latest available numerical median earnings data for the specified degree. If data is available for both 1-year and 2-year median earnings, include both values. If only one metric is available, return just that one."""),
                types.Part.from_text(text="""Computer Science, 1 year median earnings, 2 year median earnings"""),
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

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate()