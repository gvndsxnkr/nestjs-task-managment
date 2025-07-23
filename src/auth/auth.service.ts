import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Add methods for authentication, such as login, register, etc.
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    // Implementation goes here
    const { password } = authCredentialsDto;

    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Login successful';
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
