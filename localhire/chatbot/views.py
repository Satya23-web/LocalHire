from django.shortcuts import render
import os
from openai import OpenAI
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

api_key = os.getenv("OPENAI_API_KEY")

@api_view(['POST'])
def chatbot_response(request):
    message = request.data.get("message")

    if not message:
        return Response({"error": "No message provided"}, status=400)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for LocalHire platform. Help users find services like electrician, plumber, etc."},
            {"role": "user", "content": message}
        ]
    )

    return Response({
        "reply": response.choices[0].message.content
    })

