from decouple import config as config_decouple

_AzureDB = "postgresql://Javier@enginyeriadelsoftware-server:" \
           "EnginyeriaDelSoftware2022@enginyeriadelsoftware-server.postgres.database.azure.com:5432/postgres"

_PRODUCTION = config_decouple("PRODUCTION", cast=bool, default=False)


class Config(object):
    PRODUCTION = _PRODUCTION
    RECREATE_DB_ON_STARTUP = config_decouple("RECREATE_DB_ON_STARTUP", cast=bool, default=False)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = config_decouple("SECRET_KEY", default="p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B")
    STATIC_URL_PATH = ""
    STATIC_FOLDER = "/static"
    TEMPLATE_FOLDER = "/templates"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = config_decouple("SQLALCHEMY_DATABASE_URI", default=_AzureDB)


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = config_decouple("SQLALCHEMY_DATABASE_URI", default="sqlite:///data.db")


configurations = {"development": DevelopmentConfig, "production": ProductionConfig}

environment = configurations["development"] if not _PRODUCTION else configurations["production"]
