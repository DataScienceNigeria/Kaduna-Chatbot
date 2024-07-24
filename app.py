import os
import pandas as pd
import psycopg2
from flask_caching import Cache
from flask import Flask, send_file
from dotenv import load_dotenv
from flask import jsonify

from blueprints.microplan.microplan import microplan_bp_
from blueprints.weather.weather import weather_bp
from blueprints.askchat.askchat import askchat_bp

app = Flask(__name__)
app.json.sort_keys = False
app.register_blueprint(microplan_bp_)
app.register_blueprint(weather_bp, url_prefix="/weather")
app.register_blueprint(askchat_bp, url_prefix="/askchat")

app.config['CACHE_TYPE'] = 'simple'
cache = Cache(app)

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)
print("Connection successful")

cur = conn.cursor()
sql = pd.read_sql_query("SELECT * FROM master_microplan", conn)

cur.close()
conn.close()


if __name__ == '__main__':
    app.run(debug=True)