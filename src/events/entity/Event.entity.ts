import { CommentEntity } from 'src/comments/entity/Comment.entity';
import { UserEntity } from 'src/users/entity/User.entity';
import { AttendeeEntity } from 'src/attendees/entity/Attendee.entity';
import { Visibilty, Category } from '../interface/UserEvent.interface';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'enum', enum: Category, default: Category.WEDDING })
  category: Category;

  @Column({ nullable: false })
  venue: string;

  @Column({ nullable: false, type: 'timestamptz' })
  date_of_event: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Visibilty, default: Visibilty.PUBLIC })
  visibility: Visibilty;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_owner_id',
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.event, {
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => AttendeeEntity, (attendeeEntity) => attendeeEntity.event)
  attendees: AttendeeEntity[];

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
