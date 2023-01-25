import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity({ name: 'talle' })
export class BETalle extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;
    @Column({ unique: true, length: 3 })
    public nombre: string;

}
