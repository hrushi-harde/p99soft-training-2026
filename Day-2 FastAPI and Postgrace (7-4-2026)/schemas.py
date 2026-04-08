from pydantic import BaseModel #enforce data validation

class UserCreate(BaseModel):  
    name: str
    age: int 

class UserResponse(UserCreate):
    id: int

    class Config:
        orm_mode = True