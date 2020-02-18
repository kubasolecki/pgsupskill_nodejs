import HttpException from './http.exception';
import { CONFLICT } from '../status_codes';

class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(CONFLICT, `User with email ${email} already exists`);
  }
}

export default UserEmailAlreadyExistsException;
