from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache
from microplan import microplan_bp_
from askchat import askchat_bp
from askchat import initialize_db

db = SQLAlchemy()
migrate = Migrate()
cache = Cache()

app = Flask(__name__)

def create_app():
    #app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)


    with app.app_context():
        initialize_db(db)

    return app

# Register blueprints with URL prefixes
app.register_blueprint(microplan_bp_, url_prefix='/microplan')
app.register_blueprint(askchat_bp, url_prefix='/askchat')

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
