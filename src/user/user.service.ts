import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByUserName(createUserDto.userName);
    if (existingUser) {
      throw new ConflictException('Invalid Username');
    }

    const newUser = this.userRepo.create({
      ...createUserDto,
      createdAt: new Date(),
    });
    return await this.userRepo.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOne(id: number): Promise<User> {
    const user = this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user: User = await this.userRepo.findOneBy({ userName });

    if (user) {
      return user;
    }
    return null;
  }
}
