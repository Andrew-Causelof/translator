import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findBySlug(slug: string): Promise<Project | null> {
    return this.projectRepo.findOne({ where: { slug } });
  }

  async getAll(): Promise<Project[]> {
    return this.projectRepo.find();
  }
}
