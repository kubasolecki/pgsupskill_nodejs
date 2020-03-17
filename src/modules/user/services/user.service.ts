import { UserTypes } from '@/modules/user/user';
import { RepositoryService } from '../../../common/repository.service';
import CreateUserDto from '../validators/create-user.dto';
import UserModel from '../models/user.model';

export class UserService extends RepositoryService<
  UserTypes.User,
  CreateUserDto
> {
  mapModelToDto({ name, email }: UserTypes.User): CreateUserDto {
    return {
      name,
      email,
    };
  }

  mapDtoToModel(dto: CreateUserDto): Partial<UserTypes.User> {
    return dto;
  }

  constructor() {
    super(UserModel);
  }
}
