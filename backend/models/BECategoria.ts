import e from 'express';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index, Unique, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm'
import { BEProducto } from './BEProducto';

@Entity({ name: 'categoria' })
export class BECategoria extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nombre: string;

  // @OneToOne(() => BEProducto, { cascade: false })
  // producto: BEProducto

}