import { Schema, type HydratedDocument } from 'mongoose';
export declare const categoryOptions: string[];
export type TCategoryOptions = '3C' | '食品' | '衣服' | 'fish';
export interface IProduct {
    name: string;
    price: number;
    description: string;
    category: TCategoryOptions;
    sell: boolean;
    image: string;
}
export type ProductDocument = HydratedDocument<IProduct>;
declare const _default: import("mongoose").Model<IProduct, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IProduct, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IProduct, import("mongoose").Model<IProduct, any, any, any, any, any, IProduct>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    price?: import("mongoose").SchemaDefinitionProperty<number, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    category?: import("mongoose").SchemaDefinitionProperty<TCategoryOptions, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    sell?: import("mongoose").SchemaDefinitionProperty<boolean, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    image?: import("mongoose").SchemaDefinitionProperty<string, IProduct, import("mongoose").Document<unknown, {}, IProduct, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IProduct>, IProduct>;
export default _default;
//# sourceMappingURL=product.d.ts.map