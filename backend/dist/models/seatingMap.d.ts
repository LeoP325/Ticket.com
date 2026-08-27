import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface ISeatingMap {
    _id: Types.ObjectId;
    venue: Types.ObjectId;
    name: string;
    description: string;
    createdAt: Date;
}
export type SeatingMapDocument = HydratedDocument<ISeatingMap>;
declare const _default: import("mongoose").Model<ISeatingMap, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, ISeatingMap, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<ISeatingMap, import("mongoose").Model<ISeatingMap, any, any, any, any, any, ISeatingMap>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    venue?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: import("mongoose").SchemaDefinitionProperty<string, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, ISeatingMap, import("mongoose").Document<unknown, {}, ISeatingMap, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ISeatingMap & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, ISeatingMap>, ISeatingMap>;
export default _default;
//# sourceMappingURL=seatingMap.d.ts.map