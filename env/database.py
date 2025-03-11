from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de connexion à MySQL
DATABASE_URL = "mysql+pymysql://root:root@localhost/mydatabase"

# Créer le moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Session pour interagir avec la base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles SQLAlchemy
Base = declarative_base()