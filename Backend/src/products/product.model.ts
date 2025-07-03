import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { v4 } from "uuid";

export type ProductDocument = HydratedDocument<Product>;


@Schema()
export class Product {

    @Prop({
        type: String,
        default: v4,
        unique: true,
        index: true
    })
    _id: string;

    @Prop({ required: true })
    model: string

    @Prop({ required: true })
    brand: string

    @Prop({ required: true })
    type: string

    @Prop({ required: true })
    focalLength: string

    @Prop({ required: true })
    maxAperture: string

    @Prop({ required: true })
    mount: string

    @Prop({ required: true })
    weight: number

    @Prop({ required: true })
    hasStabilization: boolean

    @Prop({ default: true })
    active: boolean

}

export const ProductSchema = SchemaFactory.createForClass(Product);