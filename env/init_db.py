from database import engine, Base

# Créer toutes les tables définies dans `models.py`
Base.metadata.create_all(bind=engine)

print("Tables créées avec succès !")