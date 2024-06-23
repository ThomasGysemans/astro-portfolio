export abstract class DAO {
    protected static aggregatePrimaryKey<T, P extends keyof T>(primaryKey: P, all: T[]): T[P][] {
        const columns: T[P][] = [];
        for (const row of all) {
            if (!columns.includes(row[primaryKey])) {
                columns.push(row[primaryKey]);
            } else {
                break;
            }
        }
        return columns;
    }

    protected static aggregateMap<T, K extends keyof T>(separateKey: K, all: T[]): T[] {
        const map: Map<T[K], T> = new Map();
        for (const row of all) {
            const key = row[separateKey];
            if (!map.has(key)) {
                map.set(key, row);
            }
        }
        return Array.from(map.values());
    }
}