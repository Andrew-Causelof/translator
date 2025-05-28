import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('translations')
@Index(['key', 'lang'], { unique: true })
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  key: string;

  @Column()
  lang: string;

  @Column('text')
  original: string;

  @Column('text')
  translated: string;

  @CreateDateColumn()
  createdAt: Date;
}
