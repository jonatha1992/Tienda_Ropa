import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index, Unique, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm'
import { BEProducto } from './BEProducto';

@Entity({ name: 'color' })
export class BEColor extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nombre: string;

  // @OneToOne(() => BEProducto, { cascade: false })
  // producto: BEProducto

}