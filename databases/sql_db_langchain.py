import os

from dotenv import load_dotenv, find_dotenv
from langchain_community.utilities import SQLDatabase

load_dotenv(find_dotenv())

user = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST')
port = os.getenv('DB_PORT')
dbname = os.getenv('DB_NAME')

url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}"
TABLE_NAME = "master_microplan"

db = SQLDatabase.from_uri(
    url,
    include_tables=[TABLE_NAME],
    sample_rows_in_table_info=1,
)