import base64
import os
from google import genai
from google.genai import types


def generate(degree_title, missing_earnings):
    client = genai.Client(
        api_key='AIzaSyCUDtD_1tUUk-yo0Ti_vmagfPFt5CXQwKU',
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Given a degree type and one or both of the following earnings metrics: 1-year median earnings and 2-year median earnings, return only the latest available numerical earnings data for that degree. The response should strictly be a number or a list of numbers (if both earnings are requested), with no additional text or explanation."""),
                types.Part.from_text(text="""computer science, 1 year overall media earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""75000
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""computer science, 2 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""95000
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""computer science, 1 year overall median earnings and 2 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""[75000, 95000]
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""business, 1 year overall median earnings, 2 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""[60000, 80000]
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""business, 1 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""60000
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""business, 2 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""80000
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""computer science, 1 year overall median earnings, 2 year overall median earnings"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""[75000, 95000]
"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"{degree_title}, {', '.join(missing_earnings)}"),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.15,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text="""Be precise and consice"""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate("Computer Science", ["1 year overall median earnings", "2 year overall median earnings"])