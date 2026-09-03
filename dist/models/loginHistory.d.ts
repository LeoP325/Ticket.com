import { Schema, Types } from 'mongoose';
export interface ILoginHistory {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    ip?: string;
    userAgent: string;
    loggedInAt: Date;
}
declare const _default: import("mongoose").Model<ILoginHistory, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, ILoginHistory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<ILoginHistory, import("mongoose").Model<ILoginHistory, any, any, any, any, any, ILoginHistory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    deviceType?: import("mongoose").SchemaDefinitionProperty<"desktop" | "mobile" | "tablet", ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    browser?: import("mongoose").SchemaDefinitionProperty<string, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    os?: import("mongoose").SchemaDefinitionProperty<string, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    ip?: import("mongoose").SchemaDefinitionProperty<string | undefined, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    userAgent?: import("mongoose").SchemaDefinitionProperty<string, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    loggedInAt?: import("mongoose").SchemaDefinitionProperty<Date, ILoginHistory, import("mongoose").Document<unknown, {}, ILoginHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ILoginHistory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, ILoginHistory>, ILoginHistory>;
export default _default;
//# sourceMappingURL=loginHistory.d.ts.map