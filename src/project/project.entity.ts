import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string; // : "moscow-city-guide"

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @Column('simple-array', { nullable: true })
  allowedLanguages: string[]; // ["en", "ar", "cn"]

  @Column('simple-array', { nullable: true })
  allowedServices: string[]; // ["gpt", "google"]

  @Column('simple-array', { nullable: true })
  fallbackOrder: string[]; // ["gpt", "google"]
}
