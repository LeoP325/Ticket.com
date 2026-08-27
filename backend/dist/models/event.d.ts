import { Schema, type HydratedDocument, Types } from 'mongoose';
export interface IEvent {
    _id: Types.ObjectId;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    venue: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    image: string;
    price: number;
    capacity: number;
    createdAt: Date;
}
export type EventDocument = HydratedDocument<IEvent>;
declare const _default: import("mongoose").Model<IEvent, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, IEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<IEvent, import("mongoose").Model<IEvent, any, any, any, any, any, IEvent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    slug?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    title?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    subtitle?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    category?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    venue?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    image?: import("mongoose").SchemaDefinitionProperty<string, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    price?: import("mongoose").SchemaDefinitionProperty<number, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    capacity?: import("mongoose").SchemaDefinitionProperty<number, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date, IEvent, import("mongoose").Document<unknown, {}, IEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IEvent & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, IEvent>, IEvent>;
export default _default;
//# sourceMappingURL=event.d.ts.map