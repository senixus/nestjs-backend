import { IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UpdateUserRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  role: Role;
}
