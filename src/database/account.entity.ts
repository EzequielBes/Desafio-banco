import {
    Column,
    Entity,
    PrimaryColumn,
    Unique,
    OneToMany,
  } from 'typeorm';
import {TransactionEntity} from './transaction.entity'
  
@Entity('account')
@Unique(['email'])
export class AccountEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

}
