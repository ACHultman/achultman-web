// export interface Book {
//     cover: {
//         src: string;
//         alt: string;
//         dimensions: {
//             width: number;
//             height: number;
//         };
//     };
//     name: string;
//     note: string;
//     link: string;
// }

export type Book = {
    id: string;
    title: string;
    author: string;
    link: string;
    cover: string;
};
