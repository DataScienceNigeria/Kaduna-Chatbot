from flask import Flask
from flask_cors import CORS
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
cache = Cache()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.json.sort_keys = False
    app.config.from_object('config.Config')

    db.init_app(app)
    app.extensions['db'] = db
    migrate.init_app(app, db)
    cache.init_app(app)

    from microplan import microplan_bp_, initialize_db
    #from askchat import askchat_bp, initialize_db as initialize_askchat_db
    from weather import weather_bp

    app.register_blueprint(microplan_bp_, url_prefix='/microplan')
    #app.register_blueprint(askchat_bp, url_prefix='/askchat')
    app.register_blueprint(weather_bp, url_prefix='/weather')

    with app.app_context():
        # Initialize the database for microplan
        init_microplan_db = initialize_db(db)
        results = init_microplan_db()
        
        # If you need to use the results globally in microplan.py
        import microplan
        microplan.df = pd.DataFrame(results)
        app.extensions['microplan_df'] = microplan.df

        # Initialize the database for askchat if needed
        #initialize_askchat_db(db)
        #initialize_db(db)

    return app

# Ensure the app instance is created globally
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
