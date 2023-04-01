import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity({ name: 'color' })
export class BEColor extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Column()
  public nombre: string;

}