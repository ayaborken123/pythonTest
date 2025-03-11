class Departement(BaseModel):
    id: int
    name: str

class Formation(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class Student(BaseModel):
    id: int
    name: str
    age: int
    major: Optional[str] = None
    departement_id: int
    formations: List[int] = []