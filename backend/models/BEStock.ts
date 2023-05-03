import {
     Entity,
     Column,
     OneToOne,
     JoinColumn,
     PrimaryGeneratedColumn,
     BaseEntity,
} from "typeorm";
import { BEProducto } from ".";

@Entity({ name: "stock" })
export class BEStock extends BaseEntity {
     @PrimaryGeneratedColumn({ type: "int" })
     public id: number;

     @OneToOne(() => BEProducto, (producto) => producto.stock, {
          nullable: true,
          onDelete: "CASCADE",
     })
     @JoinColumn({ name: "productoId" })
     public producto: BEProducto;

     @Column({nullable:true})
     public XXS: number

     @Column({nullable:true})
     public XS: number

     @Column({nullable:true})
     public Uno: number;

     @Column({nullable:true})
     public Dos: number;

     @Column({nullable:true})
     public Tres: number;

     @Column({nullable:true})
     public Cuatro: number;

     @Column({nullable:true})
     public OchentaCinco: number;

     @Column({nullable:true})
     public Noventa: number;

     @Column({nullable:true})
     public NoventaCinco: number;
     
     @Column({nullable:true})
     public Cien: number;
     
     @Column({nullable:true})
     public S: number;
     @Column({nullable:true})
     public M: number;

     @Column({nullable:true})
     public L: number;

     @Column({nullable:true})
     public XL: number;

     @Column({nullable:true})
     public XXL: number;

     @Column({nullable:true})
     public General: number;
}
