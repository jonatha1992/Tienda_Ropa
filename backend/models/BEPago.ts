import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'pago' })
export class BEPago extends BaseEntity {

    @PrimaryGeneratedColumn() 
    public id: number ;

    @Column({ type: 'varchar'  }) 
    public tipopago: string;

    @Column({ type: 'decimal'  }) 
    public total: number ;
}