import { UserEntity } from 'src/users/entity/User.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  venue: string;

  @Column({ nullable: false, type: 'timestamptz' })
  date_of_event: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, default: 'public' })
  visibility: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.events)
  @JoinColumn({
    name: 'user_email',
    referencedColumnName: 'email',
  })
  user: UserEntity;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: new Date(),
  })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  updated_at: Date;
}
