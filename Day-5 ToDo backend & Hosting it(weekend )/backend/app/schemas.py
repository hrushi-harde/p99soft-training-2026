from pydantic import BaseModel

class TaskCreate(BaseModel):
    task: str
    priority: str

class TaskResponse(BaseModel):
    id: int
    task: str
    priority: str

    class Config:
        from_attributes = True