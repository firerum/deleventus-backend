export class CreateEventDto {
  readonly name: string;
  readonly category: string;
  readonly venue: string;
  readonly date_of_event: string;
  readonly description: string;
  readonly visibility: string;
  readonly user_email: string;
}
