import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface ISeat {
    _id: Types.ObjectId;
    seatingMap: Types.ObjectId;
    event: Types.ObjectId;
    section: string;
    row: string;
    number: number;
    type: string;
    price: number;
    status: 'available' | 'booked';
    heldBy?: Types.ObjectId;
    heldUntil?: Date;
    bookedBy?: Types.ObjectId;
    bookedAt?: Date;
}
export type SeatDocument = HydratedDocument<ISeat>;
declare const _default: import("mongoose").Model<ISeat, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, ISeat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<ISeat, import("mongoose").Model<ISeat, any, any, any, any, any, ISeat>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    seatingMap?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    event?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    section?: import("mongoose").SchemaDefinitionProperty<string, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    row?: import("mongoose").SchemaDefinitionProperty<string, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    number?: import("mongoose").SchemaDefinitionProperty<number, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    type?: import("mongoose").SchemaDefinitionProperty<string, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    price?: import("mongoose").SchemaDefinitionProperty<number, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<"available" | "booked", ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    heldBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    heldUntil?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    bookedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    bookedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ISeat, import("mongoose").Document<unknown, {}, ISeat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeat & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, ISeat>, ISeat>;
export default _default;
//# sourceMappingURL=seat.d.ts.map