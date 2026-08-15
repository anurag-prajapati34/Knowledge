from app.config import settings
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

_llm = None

SYSTEM_PROMPT = """You are a helpful assistant answering questions based only on the provided context.
If the answer isn't in the context, say you don't know — don't make things up."""


def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.gemini_api_key,
        )
    return _llm


def generate_answer(question: str, context: str):
    llm = get_llm()
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
    ]
    response = llm.invoke(messages)
    return response.content
