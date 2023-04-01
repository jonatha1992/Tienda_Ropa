import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'usuario' })
export class BEUsuario extends BaseEntity {

    @PrimaryColumn({ type: 'varchar' }) 
    public email: string;

    @Column({ type: 'varchar'  }) 
    public password: string;
}