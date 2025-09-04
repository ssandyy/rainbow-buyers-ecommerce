import mongoose, { Connection } from "mongoose";

function resolveMongoUrl(): string | undefined {
    return (
        process.env.DATABASE_URL ||
        process.env.MONGODB_URI ||
        process.env.MONGODB_URL ||
        undefined
    );
}

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}


global.mongoose ||= { conn: null, promise: null } as { conn: Connection | null; promise: Promise<Connection> | null };

const cached = global.mongoose;

export async function connectToDatabase(): Promise<Connection> {
    if (cached.conn) return cached.conn;

    const mongoUrl = resolveMongoUrl();
    if (!mongoUrl) {
        throw new Error("Missing DATABASE_URL / MONGODB_URI / MONGODB_URL environment variable");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(mongoUrl, { dbName: "rainbowbuyers", bufferCommands: false })
            .then((m) => m.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
