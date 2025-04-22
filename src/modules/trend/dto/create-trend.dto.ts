import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateTrendDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsUrl()
  url: string;
}
