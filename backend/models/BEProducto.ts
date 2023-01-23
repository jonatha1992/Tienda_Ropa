import { detalle } from './BEDetalle';
import { categoria } from './BECategoria';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, OneToOne, BaseEntity } from 'typeorm'


@Entity()
export class producto extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public nombre: string;
  @OneToOne(type => categoria) @JoinColumn()
  public categoria: categoria;
  @OneToMany(type => detalle, detalle => detalle.producto)
  public detalles: detalle[];
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


