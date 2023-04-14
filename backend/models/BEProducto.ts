import { BECategoria, BEColor, BEStock } from '.';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, OneToOne, BaseEntity, JoinTable, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'


@Entity({ name: 'producto' })
export class BEProducto extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public titulo: string;

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

  @Column({ type: "decimal", nullable: true })
  public precio: number;

  @Column({ type: 'varchar', nullable: true })
  public imagen: string;

  @CreateDateColumn()
  public createtAt: Date;

  @UpdateDateColumn()
  public updateAt: Date;

  // verificarCamposVacios(): boolean {
  //   for (let propiedad in this) {
  //     if (!this[propiedad]) {
  //       return true; // hay un campo vacío
  //     }
  //   }
  //   return false; // no hay campos vacíos
  // }

}

