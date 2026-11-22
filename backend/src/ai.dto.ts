import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsIn, IsNumber,
  IsObject, IsString, Max, MaxLength, Min, ValidateNested,
} from 'class-validator';

const CHANNELS = ['whatsapp', 'telegram', 'facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'];
const LANGUAGES = ['am', 'en', 'om'];

export class ProductDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100_000_000)
  price!: number;
}

export class GenerateContentDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ProductDto)
  product!: ProductDto;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @ArrayUnique()
  @IsIn(CHANNELS, { each: true })
  channels!: string[];

  @IsString()
  @IsIn(['friendly', 'professional', 'urgent'])
  tone!: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsIn(LANGUAGES, { each: true })
  languages!: string[];
}
