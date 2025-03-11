from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Table pour les départements
class Departement(Base):
    __tablename__ = "departements"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    students = relationship("Student", back_populates="departement")

# Table pour les formations
class Formation(Base):
    __tablename__ = "formations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    students = relationship("Student", secondary="student_formation", back_populates="formations")

# Table pour les étudiants
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    major = Column(String, nullable=True)
    departement_id = Column(Integer, ForeignKey("departements.id"))
    departement = relationship("Departement", back_populates="students")
    formations = relationship("Formation", secondary="student_formation", back_populates="students")

# Table d'association pour la relation many-to-many entre étudiants et formations
student_formation = Table(
    "student_formation",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id")),
    Column("formation_id", Integer, ForeignKey("formations.id")),
)