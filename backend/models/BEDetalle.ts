import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm'
import { BEProducto } from './BEProducto';
import { BETalle } from './BETalle';



@Entity({ name: 'detalle' })
export class BEDetalle extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => BEProducto, (producto) => producto.detalles)
  public producto: BEProducto

  @ManyToOne(() => BETalle, { cascade: false }) @JoinColumn()
  public talle: BETalle;

  @Column()
  public stock: number

}