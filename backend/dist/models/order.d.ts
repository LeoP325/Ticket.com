import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface ICart {
    product: Types.ObjectId;
    quantity: number;
}
export interface IOrder {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    cart: ICart[];
    createdAt: Date;
    updatedAt: Date;
}
export type OrderDocument = HydratedDocument<IOrder>;
declare const _default: import("mongoose").Model<IOrder, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IOrder, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IOrder, import("mongoose").Model<IOrder, any, any, any, any, any, IOrder>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    cart?: import("mongoose").SchemaDefinitionProperty<ICart[], IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IOrder>, IOrder>;
export default _default;
//# sourceMappingURL=order.d.ts.map