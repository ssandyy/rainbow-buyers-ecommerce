import mongoose, { Connection } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI as string;

if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL environment variable");
}

declare global {
    // Extend NodeJS global type
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

// ✅ Ensure global.mongoose is always initialized
global.mongoose ||= { conn: null, promise: null };

const cached = global.mongoose;

export async function connectToDatabase(): Promise<Connection> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, { dbName: "rainbowbuyers", bufferCommands: false })
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
