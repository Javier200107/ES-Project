# Flask configuration


class Config:
    pass


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = (
        "postgresql://Javier@enginyeriadelsoftware-server:EnginyeriaDelSoftware2022"
        "@enginyeriadelsoftware-server.postgres.database.azure.com:5432/postgres "
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STATIC_URL_PATH = ""
    STATIC_FOLDER = "/static"
    TEMPLATE_FOLDER = "/templates"
    SECRET_KEY = "p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///data.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B"
    STATIC_URL_PATH = ""
    STATIC_FOLDER = "/static"
    TEMPLATE_FOLDER = "/templates"


configuration = {"development": DevelopmentConfig, "production": ProductionConfig}
