from typing import List, Optional
from sqlmodel import Session, select
from app.models.user import User, UserCreate
from app.models.role import Role, RoleType
from app.models.user_role import UserRole
from sqlalchemy import or_, func

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.exec(select(User).where(User.username == username)).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.exec(select(User).where(User.email == email)).first()

def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> Optional[User]:
    return db.exec(select(User).where(User.firebase_uid == firebase_uid)).first()

def create_user_from_firebase(db: Session, firebase_user: dict) -> User:
    # Verificar si es el primer usuario en el sistema
    user_count = db.exec(select(func.count(User.id))).first()
    is_first_user = user_count == 0
    
    new_user = User(
        firebase_uid=firebase_user['uid'],
        email=firebase_user['email'],
        username=firebase_user.get('email', '').split('@')[0] if firebase_user.get('email') else None,
        nombre=firebase_user.get('name') # Opcional, si viene de Firebase
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Si es el primer usuario, asignarle automáticamente el rol de admin
    if is_first_user:
        admin_role = db.exec(select(Role).where(Role.name == RoleType.ADMIN)).first()
        if admin_role:
            user_role = UserRole(
                user_id=new_user.id,
                role_id=admin_role.id,
                assigned_by=None  # Auto-asignado para el primer usuario
            )
            db.add(user_role)
            db.commit()
            print(f"✅ Primer usuario creado con rol de administrador: {new_user.email}")
        else:
            print("⚠️ Rol de admin no encontrado. Ejecute primero la inicialización de roles.")
    else:
        # Para todos los demás usuarios, asignar el rol de USER por defecto
        user_role_def = db.exec(select(Role).where(Role.name == RoleType.USER)).first()
        if user_role_def:
            user_role = UserRole(
                user_id=new_user.id,
                role_id=user_role_def.id,
                assigned_by=None # Auto-asignado
            )
            db.add(user_role)
            db.commit()
            print(f"✅ Nuevo usuario '{new_user.email}' asignado con rol por defecto 'USER'.")
        else:
            print(f"⚠️ Rol 'USER' no encontrado para el usuario '{new_user.email}'. Ejecute la inicialización de roles.")

    return new_user
    
def create_user(db: Session, user_create: UserCreate) -> User:
    # Esta función se mantiene por si se quiere crear un usuario con el método tradicional
    new_user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=user_create.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all_users(db: Session) -> List[User]:
    return db.exec(select(User)).all()

def search_users(db: Session, query: str) -> List[User]:
    search_pattern = f"%{query}%"
    return db.exec(select(User).where(
        or_(
            User.username.ilike(search_pattern),
            User.email.ilike(search_pattern)
        )
    )).all()

def make_user_admin(db: Session, user_id: int, assigned_by_id: Optional[int] = None) -> bool:
    """Asignar rol de admin a un usuario específico"""
    user = db.get(User, user_id)
    if not user:
        return False
    
    admin_role = db.exec(select(Role).where(Role.name == RoleType.ADMIN)).first()
    if not admin_role:
        return False
    
    # Verificar si ya tiene el rol de admin
    existing_role = db.exec(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == admin_role.id,
            UserRole.is_active == True
        )
    ).first()
    
    if existing_role:
        return True  # Ya es admin
    
    # Asignar rol de admin
    user_role = UserRole(
        user_id=user_id,
        role_id=admin_role.id,
        assigned_by=assigned_by_id
    )
    db.add(user_role)
    db.commit()
    return True

def create_user_with_role(db: Session, user_create: UserCreate, role_name: str) -> User:
    """Crear un usuario y asignarle un rol específico"""
    # Crear el usuario básico
    new_user = User(
        firebase_uid=user_create.uid,
        email=user_create.email,
        username=user_create.username if user_create.username else None,
        is_active=user_create.is_active if user_create.is_active is not None else True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Buscar el rol especificado
    role = db.exec(select(Role).where(Role.name == role_name)).first()
    if not role:
        # Si no se encuentra el rol, crear el usuario sin rol
        print(f"⚠️ Rol '{role_name}' no encontrado. Usuario creado sin rol.")
        return new_user
    
    # Asignar el rol al usuario
    user_role = UserRole(
        user_id=new_user.id,
        role_id=role.id,
        assigned_by=None  # Auto-asignado durante la inicialización
    )
    db.add(user_role)
    db.commit()
    
    return new_user