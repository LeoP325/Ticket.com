import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface IVenue {
    _id: Types.ObjectId;
    name: string;
    address: string;
    city: string;
    description: string;
    createdAt: Date;
}
export type VenueDocument = HydratedDocument<IVenue>;
declare const _default: import("mongoose").Model<IVenue, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IVenue, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IVenue, import("mongoose").Model<IVenue, any, any, any, any, any, IVenue>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: import("mongoose").SchemaDefinitionProperty<string, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    address?: import("mongoose").SchemaDefinitionProperty<string, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    city?: import("mongoose").SchemaDefinitionProperty<string, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IVenue, import("mongoose").Document<unknown, {}, IVenue, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IVenue & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IVenue>, IVenue>;
export default _default;
//# sourceMappingURL=venue.d.ts.map