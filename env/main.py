from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Departement, Formation, Student, student_formation
from schemas import DepartementCreate, Departement, FormationCreate, Formation, StudentCreate, Student
import models

app = FastAPI()

# Créer toutes les tables dans la base de données (si elles n'existent pas déjà)
Base.metadata.create_all(bind=engine)

# Dépendance pour obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route pour obtenir tous les étudiants
@app.get("/students", response_model=List[Student])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

# Route pour obtenir un étudiant par ID
@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    return student

# Route pour ajouter un nouvel étudiant
@app.post("/students", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(
        name=student.name,
        age=student.age,
        major=student.major,
        departement_id=student.departement_id,
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    for formation_id in student.formations:
        formation = db.query(models.Formation).filter(models.Formation.id == formation_id).first()
        if formation:
            db_student.formations.append(formation)
    db.commit()
    db.refresh(db_student)
    return db_student

# Route pour mettre à jour un étudiant existant
@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, updated_student: StudentCreate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    student.name = updated_student.name
    student.age = updated_student.age
    student.major = updated_student.major
    student.departement_id = updated_student.departement_id
    student.formations = []
    for formation_id in updated_student.formations:
        formation = db.query(models.Formation).filter(models.Formation.id == formation_id).first()
        if formation:
            student.formations.append(formation)
    db.commit()
    db.refresh(student)
    return student

# Route pour supprimer un étudiant
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    db.delete(student)
    db.commit()
    return {"message": f"Étudiant avec ID {student_id} supprimé"}