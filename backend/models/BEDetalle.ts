import { talle } from './BETalle';
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm'
import { producto } from './BEProducto';



@Entity()
export class detalle extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => producto, (producto) => producto.detalles)
  public producto: producto

  @OneToOne(() => talle) @JoinColumn()
  public talle: talle;

  @Column()
  public stock: number

}