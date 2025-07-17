from pydantic import BaseModel
from typing import Dict

# Modelo para mensajes
class MsgPayload(BaseModel):
    msg_id: int
    msg_name: str

# Modelo para usuarios
class UsuarioRegistro(BaseModel):
    nombre: str
    apellido: str
    email: str
    contraseña: str

# Modelo para productos (si es necesario)
class Producto(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    imagen_url: str
    imagen: str