from sqlalchemy.orm import Session
from . import models

def get_tasks(db: Session):
    return db.query(models.Task).all()

def create_task(db: Session, task, priority):
    db_task = models.Task(task=task, priority=priority)
    db.add(db_task)
    db.commit()        
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return {"message": "Task deleted"}