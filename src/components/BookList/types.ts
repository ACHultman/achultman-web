export interface Book {
    cover: {
        src: string;
        alt: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
    name: string;
    note: string;
    link: string;
}
