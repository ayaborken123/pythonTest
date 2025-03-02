"use client"; // Indique que ce composant est un Client Component(est exécuté côté client)

import { useEffect, useState } from 'react';//Hook React pour communiquer avec le backend API FastAPI.
//useState : Hook React pour gérer l'état local du composant

export default function StudentsPage() {
  const [students, setStudents] = useState([]);// Liste des étudiants
  // name, age, major sont des États pour stocker les valeurs du formulaire
  const [name, setName] = useState('');// Nom de l'étudiant à ajouter/modifier
  const [age, setAge] = useState('');// Âge de l'étudiant à ajouter/modifier
  const [major, setMajor] = useState('');// Majeure de l'étudiant à ajouter/modifier
  const [editingStudent, setEditingStudent] = useState(null);// Étudiant en cours de modification
  //editingStudent : Stocke l'étudiant en cours de modification (ou null si aucun étudiant n'est en cours de modification).

  // Récupérer la liste des étudiants au chargement de la page
  useEffect(() => {//useEffect : Exécute la fonction au chargement du composant
    fetch('http://127.0.0.1:8000/students')//fetch : Envoie une requête GET à l'API pour récupérer la liste des étudiants
      .then((response) => response.json())//response.json() : Convertit la réponse en JSON
      .then((data) => setStudents(data))//setStudents(data) : Met à jour l'état students avec les données reçues
      .catch((error) => console.error("Erreur lors de la récupération des étudiants :", error));//catch : Gère les erreurs de réseau ou de serveur
  }, []);

  // Ajouter un nouvel étudiant
  const handleAddStudent = async (e) => {
    e.preventDefault();// Empêche le rechargement de la page par défaut du formulaire
    const newStudent = { id: students.length + 1, name, age: parseInt(age), major };//Crée un nouvel objet étudiant avec les valeurs des champs du formulaire

    console.log("Données envoyées (Ajout) :", JSON.stringify(newStudent));

    try {
      const response = await fetch('http://127.0.0.1:8000/students', {// Envoie une requête POST à l'API pour ajouter l'étudiant
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      console.log("Statut de la réponse (Ajout) :", response.status);

      if (response.ok) {
        const addedStudent = await response.json();
        console.log("Réponse de l'API (Ajout) :", addedStudent);
        setStudents([...students, addedStudent]);// Met à jour la liste des étudiants avec le nouvel étudiant.
        setName('');//// Réinitialise le champ "Nom"
        setAge('');//// Réinitialise le champ "Âge"
        setMajor('');//// Réinitialise le champ "Majeure"
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de l'ajout de l'étudiant :", error);
    }
  };

  // Supprimer un étudiant
  const handleDeleteStudent = async (id) => {
    console.log("Suppression de l'étudiant avec l'ID :", id);

    try {
      const response = await fetch(`http://127.0.0.1:8000/students/${id}`, {
        method: 'DELETE',
      });

      console.log("Statut de la réponse (Suppression) :", response.status);

      if (response.ok) {
        setStudents(students.filter((student) => student.id !== id));//// Met à jour la liste des étudiants en excluant l'étudiant supprimé.
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression de l'étudiant :", error);
    }
  };

  // Mettre à jour un étudiant
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const updatedStudent = { id: editingStudent.id, name, age: parseInt(age), major };//Crée un objet étudiant mis à jour avec les valeurs des champs du formulaire.

    console.log("Données envoyées (Mise à jour) :", JSON.stringify(updatedStudent));

    try {
      const response = await fetch(`http://127.0.0.1:8000/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });

      console.log("Statut de la réponse (Mise à jour) :", response.status);

      if (response.ok) {
        const updatedStudentData = await response.json();
        console.log("Réponse de l'API (Mise à jour) :", updatedStudentData);
        setStudents(students.map((student) =>
          student.id === updatedStudentData.id ? updatedStudentData : student // Met à jour la liste des étudiants avec l'étudiant modifié
        ));
        setEditingStudent(null);// Réinitialise l'étudiant en cours de modification
        setName('');
        setAge('');
        setMajor('');
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la mise à jour de l'étudiant :", error);
    }
  };

  // Remplir le formulaire avec les données de l'étudiant à modifier
  const startEditing = (student) => {
    setEditingStudent(student);//// Définit l'étudiant en cours de modification
    setName(student.name);// // Remplit les champs 
    setAge(student.age);
    setMajor(student.major);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>Liste des étudiants</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {students.map((student) => (//students.map : Affiche chaque étudiant dans une liste.
          <li
            key={student.id}
            style={{
              marginBottom: '10px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: '18px', color: 'white' }}>{student.name}</strong> - {student.age} ans - {student.major}
            </div>
            <div>
              <button
                onClick={() => startEditing(student)}//startEditing : Déclenche la modification d'un étudiant.
                style={{
                  marginLeft: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteStudent(student.id)}//handleDeleteStudent : Déclenche la suppression d'un étudiant
                style={{
                  marginLeft: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#e53935')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#f44336')}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
  
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: 'white' }}>
        {editingStudent ? "Modifier un étudiant" : "Ajouter un étudiant"}
      </h2>
      <form
        onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}// Déclenche handleAddStudent ou handleUpdateStudent selon le contexte
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
      >
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid white', fontSize: '16px' }}
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Majeure"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
        >
          {editingStudent ? "Mettre à jour" : "Ajouter"}
        </button>
        {editingStudent && (
          <button
            type="button"
            onClick={() => setEditingStudent(null)}
            style={{
              padding: '10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#e53935')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f44336')}
          >
            Annuler
          </button>
        )}
      </form>
    </div>
  );
}