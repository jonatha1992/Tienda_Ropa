import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Index, Unique, OneToMany, ManyToMany, ManyToOne, OneToOne } from 'typeorm'

@Entity({ name: 'categoria' })
export class BECategoria extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Column()
  public nombre: string;

  // @OneToOne(() => BEProducto, { cascade: false })
  // producto: BEProducto

}