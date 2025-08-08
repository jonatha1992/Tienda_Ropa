from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.db.session import get_session
from app.models.role import Role, RoleCreate, RoleRead, RoleUpdate
from app.models.user_role import UserRoleCreate, UserRoleRead
from app.models.user import User, UserRead
from app.controllers.role_controller import (
    create_role, get_role_by_id, get_all_roles, update_role, delete_role,
    assign_role_to_user, remove_role_from_user, get_user_roles, get_users_with_role,
    initialize_default_roles
)
from app.core.security import require_admin, get_current_db_user

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/initialize")
async def initialize_roles(
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Inicializar roles por defecto (solo admin)"""
    initialize_default_roles(db)
    return {"message": "Default roles initialized successfully"}

@router.post("/", response_model=RoleRead)
async def create_new_role(
    role: RoleCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Crear un nuevo rol (solo admin)"""
    return create_role(db, role)

@router.get("/", response_model=List[RoleRead])
async def list_roles(
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Listar todos los roles (solo admin)"""
    return get_all_roles(db)

@router.get("/{role_id}", response_model=RoleRead)
async def get_role(
    role_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Obtener un rol por ID (solo admin)"""
    role = get_role_by_id(db, role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return role

@router.put("/{role_id}", response_model=RoleRead)
async def update_existing_role(
    role_id: int,
    role_update: RoleUpdate,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Actualizar un rol (solo admin)"""
    role = update_role(db, role_id, role_update)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return role

@router.delete("/{role_id}")
async def delete_existing_role(
    role_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Eliminar un rol (solo admin)"""
    success = delete_role(db, role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return {"message": "Role deleted successfully"}

@router.post("/assign")
async def assign_user_role(
    assignment: UserRoleCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Asignar un rol a un usuario (solo admin)"""
    user_role = assign_role_to_user(
        db, 
        assignment.user_id, 
        assignment.role_id,
        current_user.id
    )
    return {"message": "Role assigned successfully", "user_role_id": user_role.id}

@router.delete("/assign/{user_id}/{role_id}")
async def remove_user_role(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Remover un rol de un usuario (solo admin)"""
    success = remove_role_from_user(db, user_id, role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User role assignment not found"
        )
    return {"message": "Role removed successfully"}

@router.get("/user/{user_id}", response_model=List[RoleRead])
async def get_user_roles_endpoint(
    user_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Obtener roles de un usuario específico (solo admin)"""
    return get_user_roles(db, user_id)

@router.get("/{role_id}/users", response_model=List[UserRead])
async def get_role_users(
    role_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """Obtener usuarios que tienen un rol específico (solo admin)"""
    return get_users_with_role(db, role_id)

@router.get("/me/roles", response_model=List[RoleRead])
async def get_my_roles(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_db_user)
):
    """Obtener los roles del usuario actual"""
    return get_user_roles(db, current_user.id)
