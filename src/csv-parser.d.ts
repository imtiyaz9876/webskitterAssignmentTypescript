declare module 'csv-parser' {
    import { Transform } from 'stream';

    interface Options {
        separator?: string;
        quote?: string;
        escape?: string;
        headers?: string[] | boolean;
        strict?: boolean;
        skipLines?: number;
        mapHeaders?: (header: string, index: number) => string;
    }

    function csvParser(options?: Options): Transform;

    export = csvParser;
}
