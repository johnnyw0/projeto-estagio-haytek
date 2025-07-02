import { IsBoolean, IsString, IsNotEmpty, IsNumber} from "class-validator";


export class CreateProductDto {

    @IsString({ message: 'O modelo deve ser uma string.' })
    @IsNotEmpty({ message: 'O modelo é obrigatório.' })
    model: string;

    @IsString({ message: 'A marca deve ser uma string.' })
    @IsNotEmpty({ message: 'A marca é obrigatória.' })
    brand: string;

    @IsString({ message: 'O tipo deve ser uma string.' })
    @IsNotEmpty({ message: 'O tipo é obrigatório.' })
    type: string;

    @IsString({ message: 'O comprimento focal deve ser uma string.' })
    @IsNotEmpty({ message: 'O comprimento focal é obrigatório.' })
    focalLength: string; 

    @IsString({ message: 'A abertura máxima deve ser uma string.' })
    @IsNotEmpty({ message: 'A abertura máxima é obrigatória.' })
    maxAperture: string;

    @IsString({ message: 'Mount deve ser uma string.' })
    @IsNotEmpty({ message: 'Mount é obrigatório.' })
    mount: string;

    @IsNumber({}, { message: 'O peso deve ser um número.' })
    @IsNotEmpty({ message: 'O peso é obrigatório.' })
    weight: number; 

    @IsBoolean({ message: 'hasStabilization deve ser um booleano.' })
    @IsNotEmpty({ message: 'hasStabilization é obrigatório.' })
    hasStabilization?: boolean;


}

