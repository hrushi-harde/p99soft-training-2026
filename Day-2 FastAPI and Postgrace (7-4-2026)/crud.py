from sqlalchemy.orm import Session 
import models, schemas   

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, age=user.age)
    db.add(db_user) 
    db.commit() 
    db.refresh(db_user) 
    return db_user

def get_users(db: Session): 
    return db.query(models.User).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first() 

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = get_user(db, user_id) 
    if db_user:
        db_user.name = user.name  
        db_user.age = user.age   
        db.commit()             
        db.refresh(db_user)     
    return {"db_user": db_user, "message": "User updated successfully"}  

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)    #find user in DB
    if db_user:
        db.delete(db_user)  
        db.commit()           
    return db_user           