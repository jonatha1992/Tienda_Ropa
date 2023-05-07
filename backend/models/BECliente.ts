import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'cliente' })
export class BECliente extends BaseEntity {

    @PrimaryColumn({ type: 'int' }) 
    public dni: number;

    @Column({ type: 'varchar' }) 
    public nombre: string;

    @Column({ type: 'varchar'  }) 
    public telefono: number;

    // @Column({ type: 'varchar' }) 
    // public domicilio: string;

}