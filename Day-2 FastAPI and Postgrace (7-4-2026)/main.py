from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session 
import models, schemas, crud  
from database import SessionLocal, engine, Base 

Base.metadata.create_all(bind=engine) 

app = FastAPI()    #backend server 

# Dependency
def get_db():
    db = SessionLocal()
    try:                     
        yield db
    finally:
        db.close()

# POST
@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

# GET ALL
@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

# GET ONE
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# PUT
@app.put("/users/{user_id}")
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    updated = crud.update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

# DELETE
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}