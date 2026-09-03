import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface IRaffleEntry {
    _id: Types.ObjectId;
    event: Types.ObjectId;
    user: Types.ObjectId;
    quantity: number;
    status: 'pending' | 'won' | 'lost';
    seatLabels: string[];
    createdAt: Date;
    updatedAt: Date;
}
export type RaffleEntryDocument = HydratedDocument<IRaffleEntry>;
declare const _default: import("mongoose").Model<IRaffleEntry, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IRaffleEntry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IRaffleEntry, import("mongoose").Model<IRaffleEntry, any, any, any, any, any, IRaffleEntry>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    event?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<"pending" | "won" | "lost", IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    seatLabels?: import("mongoose").SchemaDefinitionProperty<string[], IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date, IRaffleEntry, import("mongoose").Document<unknown, {}, IRaffleEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IRaffleEntry & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IRaffleEntry>, IRaffleEntry>;
export default _default;
//# sourceMappingURL=raffleEntry.d.ts.map