import HttpException from '../../../exceptions/http.exception';
import { BAD_REQUEST } from '../../../status_codes';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(BAD_REQUEST, `Login or password are incorrect`);
  }
}

export default WrongCredentialsException;
