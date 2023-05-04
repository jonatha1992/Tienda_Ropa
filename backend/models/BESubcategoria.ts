import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index, Unique, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm'

@Entity({ name: 'subcategoria' })
export class BESubategoria extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Column()
  public nombre: string;

  // @OneToOne(() => BEProducto, { cascade: false })
  // producto: BEProducto 

}