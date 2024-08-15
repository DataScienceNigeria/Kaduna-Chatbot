from flask import Flask
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
cache = Cache()

#app = Flask(__name__)

def create_app():
    app = Flask(__name__)
    app.json.sort_keys = False
    app.config.from_object('config.Config')

    db.init_app(app)
    app.extensions['db'] = db
    migrate.init_app(app, db)
    cache.init_app(app)

    from microplan import microplan_bp_, initialize_db
    from askchat import askchat_bp, initialize_db as initialize_askchat_db
    from weather import weather_bp

    app.register_blueprint(microplan_bp_, url_prefix='/microplan')
    app.register_blueprint(askchat_bp, url_prefix='/askchat')
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
        initialize_askchat_db(db)
        #initialize_db(db)

    return app

#app = create_app

# Register blueprints with URL prefixes
# app.register_blueprint(microplan_bp_, url_prefix='/microplan')
# app.register_blueprint(askchat_bp, url_prefix='/askchat')

if __name__ == "__main__":
    app = create_app()
    app.json.sort_keys = False
    app.run(debug=True, host="0.0.0.0", port=8000)
