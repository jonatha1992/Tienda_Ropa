import { BEDetalle } from './BEDetalle';
import { BECategoria } from './BECategoria';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, OneToOne, BaseEntity, JoinTable, ManyToOne } from 'typeorm'


@Entity({ name: 'producto' })
export class BEProducto extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public nombre: string;
  @ManyToOne(type => BECategoria, categoria => categoria.id, { cascade: false }) @JoinColumn()
  public categoria: BECategoria;
  @OneToMany(type => BEDetalle, detalle => detalle.producto, { cascade: true })
  public detalles: BEDetalle[];
  @Column()
  public descripcion: string;

}


