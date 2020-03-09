import { UserTypes } from '@/modules/user/user';
import { RepositoryService } from '../../../common/repository.service';
import CreateUserDto from '../../auth/validators/create-user.dto';
import UserModel from '../models/user.model';

export class UserService extends RepositoryService<
  UserTypes.User,
  CreateUserDto
> {
  mapModelToDto({email, password}: UserTypes.User): CreateUserDto {
    return {
      email,
      password
    }
  }
  mapDtoToModel(dto: CreateUserDto) {
    return {
      email: dto.email,
    };
  }
  constructor() {
    super(UserModel);
  }
}
