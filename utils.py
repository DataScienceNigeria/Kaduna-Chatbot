from langchain_openai import ChatOpenAI
# from langchain_groq import ChatGroq
from constants import chat_groq_model_kwargs, langchain_chat_kwargs

# Optional, set the API key for OpenAI if it's not set in the environment.
# os.environ["OPENAI_API_KEY"] = "xxxxxx"

def get_chat_openai(model_name):
    """
    Returns an instance of the ChatOpenAI class initialized with the specified model name.

    Args:
        model_name (str): The name of the model to use.

    Returns:
        ChatOpenAI: An instance of the ChatOpenAI class.

    """

    # llm = ChatGroq(
    #     model="llama3-8b-8192",
    #     temperature=0.0,
    #     max_tokens=3000,
    #     max_retries=2,
    # )
    
    llm = ChatOpenAI(
        model=model_name,
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
    return llm