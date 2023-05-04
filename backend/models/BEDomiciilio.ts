import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'domicilio' })
export class BEDomicilio extends BaseEntity {

    @PrimaryGeneratedColumn() 
    public id: number ;

    @Column({ type: 'varchar' }) 
    public calle: string;

    @Column({ type: 'varchar'  }) 
    public entrecalle: string;
}