import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'pedido' })
export class BEPedido extends BaseEntity {

    @PrimaryGeneratedColumn() 
    public email: string;

    @Column({ type: 'varchar'  }) 
    public password: string;
}