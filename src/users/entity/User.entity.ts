import { CommentEntity } from 'src/comments/entity/Comment.entity';
import { EventEntity } from 'src/events/entity/Event.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  phone_no: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => EventEntity, (eventEntity) => eventEntity.user, {
    onDelete: 'CASCADE',
  })
  events: EventEntity[];

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user, {
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

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
