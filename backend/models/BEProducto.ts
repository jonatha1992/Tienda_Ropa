import { BEDetalle } from './BEDetalle';
import { BECategoria } from './BECategoria';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, OneToOne, BaseEntity, JoinTable, ManyToOne } from 'typeorm'


@Entity({ name: 'producto' })
export class BEProducto extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public nombre: string;
  @ManyToOne(type => BECategoria, { cascade: false }) @JoinColumn()
  public categoria: BECategoria;
  @OneToMany(type => BEDetalle, detalle => detalle.producto, { cascade: true })
  public detalles: BEDetalle[];
  @Column()
  public descripcion: string;
  @Column()
  public color: string;

  // constructor(){
  //   super();
  // }
  // constructor(pnombre: string, pdescripcion: string, pcolor: string, pcategoria: categoria) {
  //   super();
  //   this.nombre = pnombre;
  //   this.descripcion = pdescripcion;
  //   this.color = pcolor;
  //   this.categoria = pcategoria;
  // }
}


