from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
import re
from langchain.agents.agent_types import AgentType
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain.memory import ConversationBufferMemory


from utils import get_chat_openai
from tools.functions import sql_agent_tools
from databases.sql_db_langchain import db

CUSTOM_SUFFIX = """Begin!

Relevant pieces of previous conversation:
{history}
(Note: Only reference this information if it is relevant to the current query.)

Question: {input}
Thought Process: 

To answer your question accurately, I'll follow these guidelines:
1. If relevant, I'll reference our conversation history.
2. For database queries, I'll ensure precise answers from the master_microplan table.
3. I'll use get_categories and sql_db_schema tools for category alignment and schema understanding.
4. For ward-specific queries, I'll search the ward column.
5. Today's date is available via get_today_date.
6. I'll maintain trustworthiness by avoiding fabricated information.
7. Instead of responding that there is no data available, I will simply the question before answering.

{agent_scratchpad}
"""

def get_sql_toolkit(tool_llm_name: str):
    """
    Get the SQL toolkit for a given tool LLM name.

    Parameters:
        tool_llm_name (str): The name of the tool LLM.

    Returns:
        SQLDatabaseToolkit: The SQL toolkit object.
    """
    llm_tool = get_chat_openai(model_name=tool_llm_name)
    toolkit = SQLDatabaseToolkit(db=db, llm=llm_tool)
    return toolkit

def get_agent_llm(agent_llm_name: str):
    """
    Retrieves the LLM agent with the specified name.

    Parameters:
        agent_llm_name (str): The name of the LLN agent.

    Returns:
        llm_agent: The LLM agent object.
    """
    llm_agent = get_chat_openai(model_name=agent_llm_name)
    return llm_agent

def create_agent(
    tool_llm_name: str = "gpt-4-1106-preview",
    agent_llm_name: str = "gpt-4-1106-preview",
    general_model_name: str = "gpt-4-1106-preview",  # General model for non-SQL queries
):
    """
    Creates a SQL agent using the specified tool and agent LLM names.

    Args:
        tool_llm_name (str, optional): The name of the SQL toolkit LLM. Defaults to "gpt-4-1106-preview".
        agent_llm_name (str, optional): The name of the agent LLM. Defaults to "gpt-4-1106-preview".
        general_model_name (str, optional): The name of the general model for non-SQL queries. Defaults to "gpt-4-1106-preview".

    Returns:
        agent: The created SQL agent with enhanced capabilities.
    """

    agent_tools = sql_agent_tools()
    llm_agent = get_agent_llm(agent_llm_name)
    toolkit = get_sql_toolkit(tool_llm_name)
    memory = ConversationBufferMemory(memory_key="history", return_messages=True)

    agent = create_sql_agent(
        llm=llm_agent,
        toolkit=toolkit,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        input_variables=["input", "agent_scratchpad"],
        suffix=CUSTOM_SUFFIX,
        agent_executor_kwargs={"memory": memory},
        extra_tools=agent_tools,
        verbose=True,
    )

    general_agent = get_chat_openai(model_name=general_model_name)

    sql_keywords = ["SELECT", "FROM", "WHERE", "WARD", "CATEGORY", "DATE"]

    def is_sql_query(input):
        return any(re.search(r"\b" + keyword + r"\b", input, re.IGNORECASE) for keyword in sql_keywords)

    def respond(input):
        if is_sql_query(input):
            return agent.run(input)
        else:
            return general_agent.run(input)

    return agent

    # .respond = respond  # Add respond function to sql_agent

    # return sql_agent