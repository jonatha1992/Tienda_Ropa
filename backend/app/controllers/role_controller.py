from typing import List, Optional
from sqlmodel import Session, select
from app.models.role import Role, RoleCreate, RoleUpdate, RoleType
from app.models.user_role import UserRole, UserRoleCreate
from app.models.user import User

def create_role(db: Session, role_create: RoleCreate) -> Role:
    """Crear un nuevo rol"""
    db_role = Role(**role_create.model_dump())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def get_role_by_id(db: Session, role_id: int) -> Optional[Role]:
    """Obtener un rol por ID"""
    return db.get(Role, role_id)

def get_role_by_name(db: Session, name: RoleType) -> Optional[Role]:
    """Obtener un rol por nombre"""
    return db.exec(select(Role).where(Role.name == name)).first()

def get_all_roles(db: Session) -> List[Role]:
    """Obtener todos los roles"""
    return db.exec(select(Role).where(Role.is_active == True)).all()

def update_role(db: Session, role_id: int, role_update: RoleUpdate) -> Optional[Role]:
    """Actualizar un rol"""
    db_role = db.get(Role, role_id)
    if not db_role:
        return None
    
    role_data = role_update.model_dump(exclude_unset=True)
    for key, value in role_data.items():
        setattr(db_role, key, value)
    
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: int) -> bool:
    """Eliminar un rol (soft delete)"""
    db_role = db.get(Role, role_id)
    if not db_role:
        return False
    
    db_role.is_active = False
    db.add(db_role)
    db.commit()
    return True

def assign_role_to_user(db: Session, user_id: int, role_id: int, assigned_by: Optional[int] = None) -> UserRole:
    """Asignar un rol a un usuario"""
    # Verificar si ya existe la asignación
    existing = db.exec(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id,
            UserRole.is_active == True
        )
    ).first()
    
    if existing:
        return existing
    
    user_role = UserRole(
        user_id=user_id,
        role_id=role_id,
        assigned_by=assigned_by
    )
    db.add(user_role)
    db.commit()
    db.refresh(user_role)
    return user_role

def remove_role_from_user(db: Session, user_id: int, role_id: int) -> bool:
    """Remover un rol de un usuario"""
    user_role = db.exec(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id,
            UserRole.is_active == True
        )
    ).first()
    
    if not user_role:
        return False
    
    user_role.is_active = False
    db.add(user_role)
    db.commit()
    return True

def get_user_roles(db: Session, user_id: int) -> List[Role]:
    """Obtener todos los roles activos de un usuario"""
    user_roles = db.exec(
        select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.is_active == True
        )
    ).all()
    
    role_ids = [ur.role_id for ur in user_roles]
    if not role_ids:
        return []
    
    return db.exec(select(Role).where(Role.id.in_(role_ids))).all()

def get_users_with_role(db: Session, role_id: int) -> List[User]:
    """Obtener todos los usuarios que tienen un rol específico"""
    user_roles = db.exec(
        select(UserRole).where(
            UserRole.role_id == role_id,
            UserRole.is_active == True
        )
    ).all()
    
    user_ids = [ur.user_id for ur in user_roles]
    if not user_ids:
        return []
    
    return db.exec(select(User).where(User.id.in_(user_ids))).all()

def user_has_role(db: Session, user_id: int, role_name: RoleType) -> bool:
    """Verificar si un usuario tiene un rol específico"""
    user_role = db.exec(
        select(UserRole)
        .join(Role)
        .where(
            UserRole.user_id == user_id,
            Role.name == role_name,
            UserRole.is_active == True,
            Role.is_active == True
        )
    ).first()
    
    return user_role is not None

def initialize_default_roles(db: Session):
    """Inicializar los roles por defecto si no existen"""
    default_roles = [
        {"name": RoleType.ADMIN, "description": "Administrador del sistema con acceso completo"},
        {"name": RoleType.MANAGER, "description": "Manager con acceso a gestión de productos e inventario"},
        {"name": RoleType.EMPLOYEE, "description": "Empleado con acceso limitado"},
        {"name": RoleType.USER, "description": "Usuario regular de la tienda"}
    ]
    
    for role_data in default_roles:
        existing_role = get_role_by_name(db, role_data["name"])
        if not existing_role:
            role_create = RoleCreate(**role_data)
            create_role(db, role_create)
