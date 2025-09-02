import mongoose, { Connection } from "mongoose";

// Resolve URL from multiple common env names
function resolveMongoUrl(): string | undefined {
    return (
        process.env.DATABASE_URL ||
        process.env.MONGODB_URI ||
        process.env.MONGODB_URL ||
        undefined
    );
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

// ✅ Ensure global.mongoose is always initialized
// @ts-ignore
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
