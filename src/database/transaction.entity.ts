import { AccountEntity } from "./account.entity";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryColumn()
  id: string;

  @Column({ default: "pending" })
  status: string;

  
  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;


  @Column()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => AccountEntity, {nullable: false, onDelete: "NO ACTION"})
  @JoinColumn({ name: "sender_id", referencedColumnName: "id" })
  sender: AccountEntity;

    @ManyToOne(() => AccountEntity, {nullable: false, onDelete: "NO ACTION"})
    @JoinColumn({name: 'receiver_id', referencedColumnName: "id"})
    receiver: AccountEntity

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
}
