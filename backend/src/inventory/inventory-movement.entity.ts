import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

export type MovementType = 'IN' | 'OUT' | 'ADJUST';

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 10 }) // IN | OUT | ADJUST
  type: MovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ default: '' })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
