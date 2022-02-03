export interface UpdateUserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  categories: any[];
}
