import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class talle extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;
    @Column({ unique: true, length: 3 })
    public nombre: string;

}
