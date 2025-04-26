import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SummarizeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000) // guard the token budget
  text: string;
}
