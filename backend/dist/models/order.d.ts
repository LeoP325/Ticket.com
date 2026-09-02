import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface IOrderItem {
    event: Types.ObjectId;
    seat?: Types.ObjectId;
    eventTitle: string;
    seatLabel: string;
    price: number;
    quantity: number;
}
export interface IOrder {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    orderNo: string;
    status: 'paid' | 'cancelled' | 'refunded';
    totalAmount: number;
    items: IOrderItem[];
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
    orderNo?: import("mongoose").SchemaDefinitionProperty<string, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<"paid" | "cancelled" | "refunded", IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    totalAmount?: import("mongoose").SchemaDefinitionProperty<number, IOrder, import("mongoose").Document<unknown, {}, IOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IOrder & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    items?: import("mongoose").SchemaDefinitionProperty<IOrderItem[], IOrder, import("mongoose").Document<unknown, {}, IOrder, {
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