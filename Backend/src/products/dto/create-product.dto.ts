import { IsBoolean, IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class CreateProductDto {

    @IsNotEmpty({ message: 'O modelo é obrigatório.' })
    @IsString({ message: 'O modelo deve ser uma string.' })
    model: string;

    @IsNotEmpty({ message: 'A marca é obrigatória.' })
    @IsString({ message: 'A marca deve ser uma string.' })
    brand: string;

    @IsNotEmpty({ message: 'O tipo é obrigatório.' })
    @IsString({ message: 'O tipo deve ser uma string.' })
    type: string;

    @IsOptional() 
    @IsString({ message: 'O comprimento focal deve ser uma string.' })
    focalLength?: string; 

    @IsOptional()
    @IsString({ message: 'A abertura máxima deve ser uma string.' })
    maxAperture?: string;

    @IsOptional()
    @IsString({ message: 'O mount deve ser uma string.' })
    mount?: string;

    @IsNotEmpty({ message: 'O peso é obrigatório.' })
    @IsNumber({}, { message: 'O peso deve ser um número.' })
    weight: number; 

    @IsOptional()
    @IsBoolean({ message: 'hasStabilization deve ser um booleano.' })
    hasStabilization?: boolean;


}

