import { BECategoria, BEColor, BEStock } from '.';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, OneToOne, BaseEntity, JoinTable, ManyToOne } from 'typeorm'


@Entity({ name: 'producto' })
export class BEProducto extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nombre: string;

  @ManyToOne(type => BECategoria, categoria => categoria.id, { cascade: false, eager: true })
  @JoinColumn()
  public categoria: BECategoria;


  @ManyToOne(type => BEColor, color => color.id, { cascade: false, eager: true })
  @JoinColumn()
  public color: BEColor;

  @ManyToOne(type => BEStock, stock => stock.producto, { cascade: true, eager: true })
  @JoinColumn()
  public stock: BEStock;

  @Column()
  public descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  public image: string;

}

