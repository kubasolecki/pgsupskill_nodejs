import HttpException from '../../../exceptions/http.exception';
import { UNAUTHORIZED } from '../../../status_codes';

class WrongTokenException extends HttpException {
  constructor() {
    super(UNAUTHORIZED, `Unauthorized`);
  }
}

export default WrongTokenException;
