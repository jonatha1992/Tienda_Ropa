import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, BaseEntity, Index } from 'typeorm'
import { BEProducto, BEColor, BETalle } from './index';



@Entity({ name: 'detalle' })
// @Index(["productoId", "talleId", "colorId"], { unique: true })
export class BEDetalle extends BaseEntity {

  @PrimaryColumn({ type: "integer" })
  public id: number


  @ManyToOne(() => BEProducto, (producto) => producto.detalles, { nullable: false })
  @JoinColumn({
    name: "productoId"
  })
  public producto: BEProducto

  @ManyToOne(() => BETalle, { cascade: false, nullable: false })
  @JoinColumn({ name: "talleId" })
  public talle: BETalle;

  @ManyToOne(() => BEColor, { cascade: false, nullable: false })
  @JoinColumn({ name: "colorId" })
  public color: BEColor;

  @Column()
  public stock: number

}