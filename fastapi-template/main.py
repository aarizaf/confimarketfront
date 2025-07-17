from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import MsgPayload, UsuarioRegistro
import psycopg2
import base64
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64

app = FastAPI()
messages_list: dict[int, MsgPayload] = {}

# Configuración de la base de datos
DATABASE_CONFIG = {
    "dbname": "confimarket",
    "user": "postgres",
    "password": "nueva_contraseña",
    "host": "localhost",
    "port": 5433
}

conn = psycopg2.connect(**DATABASE_CONFIG)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clave de encriptación (debe ser de 16, 24 o 32 bytes)
SECRET_KEY = get_random_bytes(16)  # Genera una clave aleatoria (puedes guardarla en un lugar seguro)

def encrypt_password(password: str) -> str:
    """Encripta la contraseña usando AES."""
    cipher = AES.new(SECRET_KEY, AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(password.encode('utf-8'))
    # Devuelve la contraseña encriptada junto con el nonce (necesario para desencriptar)
    return base64.b64encode(nonce + ciphertext).decode('utf-8')

@app.get("/db-status")
def db_status():
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            return {"status": "Connected to the database"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello"}

# About page route
@app.get("/about")
def about() -> dict[str, str]:
    return {"message": "This is the about page."}

@app.post("/messages/{msg_name}/")
def add_msg(msg_name: str) -> dict[str, MsgPayload]:
    msg_id = max(messages_list.keys()) + 1 if messages_list else 0
    messages_list[msg_id] = MsgPayload(msg_id=msg_id, msg_name=msg_name)
    return {"message": messages_list[msg_id]}

# Route to list all messages
@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages:": messages_list}

@app.get("/usuarios")
def get_usuarios():
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id_usuario, nombre, apellido, email FROM usuarios")
            rows = cursor.fetchall()

            resultado = []
            for (id_usuario, nombre, apellido, email) in rows:
                resultado.append({
                    "id_usuario": id_usuario,
                    "nombre": nombre,
                    "apellido": apellido,
                    "email": email
                })
            return {"usuarios": resultado}

    except Exception as e:
        return {"error": str(e)}

@app.get("/productos")
def get_productos():
    try:
        with conn.cursor() as cursor:
            # Asegúrate de incluir id_producto en la consulta
            cursor.execute("SELECT id_producto, nombre, descripcion, precio, imagen_url, imagen FROM productos WHERE disponible = TRUE")
            rows = cursor.fetchall()

            productos = []
            for (id_producto, nombre, descripcion, precio, imagen_url, imagen) in rows:
                # Codificar la imagen en base64 si existe
                imagen_base64 = base64.b64encode(imagen).decode('utf-8') if imagen else None

                productos.append({
                    "id_producto": id_producto,  # Incluye el id_producto
                    "nombre": nombre,
                    "descripcion": descripcion,
                    "precio": float(precio),
                    "imagen_url": imagen_url,
                    "imagen": imagen_base64
                })
            return {"productos": productos}

    except Exception as e:
        return {"error": str(e)}

@app.post("/usuarios/registro")
def registrar_usuario(usuario: UsuarioRegistro):
    try:
        # Encriptar la contraseña
        contraseña_encriptada = encrypt_password(usuario.contraseña)

        with conn.cursor() as cursor:
            # Insertar el usuario en la base de datos
            cursor.execute("""
                INSERT INTO usuarios (nombre, apellido, email, contraseña_hash)
                VALUES (%s, %s, %s, %s)
            """, (usuario.nombre, usuario.apellido, usuario.email, contraseña_encriptada))
            
            conn.commit()
            return {"message": "Usuario registrado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/productos/{id_producto}")
def get_producto(id_producto: int):
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT nombre, descripcion, precio, imagen_url, imagen
                FROM productos
                WHERE id_producto = %s
            """, (id_producto,))
            row = cursor.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Producto no encontrado")

            nombre, descripcion, precio, imagen_url, imagen = row
            imagen_base64 = base64.b64encode(imagen).decode('utf-8') if imagen else None

            return {
                "nombre": nombre,
                "descripcion": descripcion,
                "precio": float(precio),
                "imagen_url": imagen_url,
                "imagen": imagen_base64
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))