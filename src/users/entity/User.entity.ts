import { CommentEntity } from 'src/comments/entity/Comment.entity';
import { EventEntity } from 'src/events/entity/Event.entity';
import { AttendeeEntity } from 'src/attendees/entity/Attendee.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Gender } from '../interface/User.interface';

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

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

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

  @Column({ nullable: true, default: false })
  is_verified: boolean;

  @OneToMany(() => EventEntity, (eventEntity) => eventEntity.user)
  events: EventEntity[];

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
  comments: CommentEntity[];

  @OneToMany(() => AttendeeEntity, (attendeeEntity) => attendeeEntity.user)
  attendees: AttendeeEntity[];

  @Column({ nullable: true })
  refresh_token: string;

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
