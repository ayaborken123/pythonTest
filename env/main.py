# Importation des modules nécessaires
from fastapi import FastAPI, HTTPException # FastAPI pour créer l'API, HTTPException pour gérer les erreurs HTTP
# Middleware pour gérer les requêtes cross-origin (CORS)
from fastapi.middleware.cors import CORSMiddleware
# Pour renvoyer des réponses JSON personnalisées
from fastapi.responses import JSONResponse
# Pour définir des modèles de données avec validation
from pydantic import BaseModel
# Pour définir des types de données (listes et champs optionnels)
from typing import List, Optional

# Initialisation de l'application FastAPI
app = FastAPI()

# Configuration de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Autorise uniquement le frontend Next.js provenant de `http://localhost:3000`
    allow_credentials=True,# Permet l'envoi de cookies ou d'en-têtes d'authentification
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, PUT, DELETE, )
    allow_headers=["*"],  # Autorise tous les en-têtes
)
# CORS est nécessaire pour permettre à un frontend  Next.js de communiquer avec l'API.

#Définition du Modèle Pydantic pour un étudiant
class Student(BaseModel):# Le modèle `Student` valide les données reçues et garantit qu'elles respectent ce schéma.
    id: int
    name: str
    age: int
    major: Optional[str] = None # Spécialisation de l'étudiant (optionnelle, par défaut `None`)

# Base de données temporaire (liste d'étudiants)
students_db = [
    {"id": 1, "name": "Alice", "age": 20, "major": "Informatique"},
    {"id": 2, "name": "Bob", "age": 22, "major": "Mathématiques"},
    {"id": 3, "name": "Charlie", "age": 21, "major": "Physique"},
]# `students_db` est une liste de dictionnaires représentant des étudiants. Chaque dictionnaire contient les clés `id`, `name`, `age`, et `major`.

# Route pour obtenir tous les étudiants
@app.get("/students", response_model=List[Student])
# `response_model=List[Student]` : Indique que la réponse sera une liste d'objets `Student`.
def get_students():# `get_students()` : Renvoie la liste complète des étudiants (`students_db`).
    return students_db 

# Route pour obtenir un étudiant par ID
@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    student = next((s for s in students_db if s['id'] == student_id), None)
      # `next(...)` : Recherche l'étudiant dans `students_db` par son ID. Si aucun étudiant n'est trouvé, renvoie `None`.
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")# Si l'étudiant n'est pas trouvé, une erreur 404 est renvoyée avec un message personnalisé.
    return student # Renvoie les données de l'étudiant trouvé.

# Route pour ajouter un nouvel étudiant
@app.post("/students", response_model=Student)
def create_student(student: Student):
    print(f"Données reçues : {student}")
    students_db.append(student.dict())
    return student

# Route pour mettre à jour un étudiant existant
@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, updated_student: Student):
    # Recherche l'étudiant dans `students_db` par son ID.
    student = next((s for s in students_db if s['id'] == student_id), None)
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé") # Si l'étudiant n'est pas trouvé, une erreur 404 est renvoyée.
    student.update(updated_student.dict()) # `student.update(...)` : Met à jour les champs de l'étudiant existant avec les nouvelles données.
    return student # Renvoie les données mises à jour.

# Route pour supprimer un étudiant
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    # Recherche l'étudiant dans `students_db` par son ID.
    student = next((s for s in students_db if s['id'] == student_id), None)
    if student:
        # Supprime l'étudiant de la base de données.
        students_db.remove(student)
        return JSONResponse(content={"message": f"Student with ID {student_id} deleted"}, status_code=200)# Renvoie un message de succès avec un code de statut 200.
    else:
        return JSONResponse(content={"error": f"Student with ID {student_id} not found"}, status_code=404)# Si l'étudiant n'est pas trouvé, renvoie un message d'erreur avec un code de statut 404.