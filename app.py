from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)

    from blueprints.microplan import microplan_bp_
    from blueprints.askchat import askchat_bp

    # Register blueprints with URL prefixes
    app.register_blueprint(microplan_bp_, url_prefix='/microplan')
    app.register_blueprint(askchat_bp, url_prefix='/askchat')

    with app.app_context():
        from blueprints.askchat.askchat import initialize_db
        initialize_db(db)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
