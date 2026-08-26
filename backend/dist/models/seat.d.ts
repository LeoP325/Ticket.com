import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface ISeat {
    number: number;
    heldBy?: Types.ObjectId;
    heldUntil?: Date;
    bookedBy?: Types.ObjectId;
    bookedAt?: Date;
}
export type SeatDocument = HydratedDocument<ISeat>;
declare const Seat: import("mongoose").Model<ISeat, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, ISeat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<ISeat, import("mongoose").Model<ISeat, any, any, any, any, any, ISeat>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    number?: import("mongoose").SchemaDefinitionProperty<number, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    heldBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    heldUntil?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    bookedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    bookedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, ISeat>, ISeat>;
export declare function ensureSeats(): Promise<void>;
export default Seat;
//# sourceMappingURL=seat.d.ts.map