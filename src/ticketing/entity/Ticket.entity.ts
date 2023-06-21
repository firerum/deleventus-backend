import { EventEntity } from 'src/events/entity/Event.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class TicketEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: false })
  attendee_email: string;

  @Column({ nullable: false })
  attendee_first_name: string;

  @Column({ nullable: false })
  attendee_last_name: string;

  @Column({ nullable: false })
  attendee_phone_no: string;

  @ManyToOne(() => EventEntity, (eventEntity) => eventEntity.tickets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'event_id',
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
