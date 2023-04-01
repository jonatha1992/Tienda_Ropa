import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'
import { BEProducto } from '.';



@Entity({ name: 'stock' })
export class BEStock extends BaseEntity {

  @PrimaryGeneratedColumn({ type: "int" })
  public id: number

  @OneToOne(() => BEProducto, (producto) => producto.stock, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "productoId" })
  public producto: BEProducto

  // @Column()
  // public XXS: number

  // @Column()
  // public XS: number

  @Column()
  public S: number

  @Column()
  public M: number

  @Column()
  public L: number

  @Column()
  public XL: number

  // @Column()
  // public XXL: number


}