"""
Script para inicializar roles por defecto y asignar admin al primer usuario.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import get_session
from app.controllers.role_controller import initialize_default_roles, assign_role_to_user, get_role_by_name
from app.controllers.user_controller import get_all_user
from app.models.role import RoleType

def init_roles_and_admin():
    """Inicializa los roles por defecto y asigna admin al primer usuario."""
    db = next(get_session())
    
    try:
        # Inicializar roles por defecto
        print("Inicializando roles por defecto...")
        initialize_default_roles(db)
        print("Roles inicializados correctamente.")
        
        # Obtener todos los usuarios
        users = get_all_user(db)
        if not users:
            print("No hay usuarios en la base de datos.")
            return
        
        # Obtener el rol admin
        admin_role = get_role_by_name(db, RoleType.ADMIN)
        if not admin_role:
            print("Error: No se pudo encontrar el rol admin.")
            return
        
        # Asignar admin al primer usuario
        first_user = users[0]
        print(f"Asignando rol admin al usuario: {first_user.email}")
        assign_role_to_user(db, first_user.id, admin_role.id)
        print("Rol admin asignado correctamente.")
        
        # Mostrar información de los usuarios y sus roles
        print("\n--- Usuarios y roles ---")
        for user in users:
            print(f"Usuario: {user.email} (ID: {user.id})")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_roles_and_admin()
