import { UserEntity } from 'src/users/entity/User.entity';
import { EventEntity } from 'src/events/entity/Event.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user: UserEntity;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_event_id',
  })
  event: EventEntity;

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
