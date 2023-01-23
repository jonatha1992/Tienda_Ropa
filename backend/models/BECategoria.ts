import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index, Unique, OneToMany, ManyToMany, ManyToOne } from 'typeorm'

@Entity()
export class categoria extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nombre: string;
}