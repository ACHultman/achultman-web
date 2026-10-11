import { Fragment, type ReactNode } from 'react';
import { Image } from '@chakra-ui/react';
import type {
    BlockObjectResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { safeUrl } from '../../utils/safeUrl';
import BlockCode from './BlockCode';

// Notion's SDK omits nested children; the service loads these explicitly.
type BlockContent = {
    rich_text?: RichTextItemResponse[];
    caption?: RichTextItemResponse[];
    children?: BlockObjectResponse[];
    language?: string;
    url?: string;
    external?: { url: string };
    file?: { url: string };
    cells?: RichTextItemResponse[][];
    has_column_header?: boolean;
    has_row_header?: boolean;
    checked?: boolean;
};

function contentOf(block: BlockObjectResponse): BlockContent {
    return (block as unknown as Record<string, BlockContent>)[block.type] || {};
}

export function RichText({ text = [] }: { text?: RichTextItemResponse[] }) {
    return (
        <>
            {text.map((part, index) => {
                let node: ReactNode = part.plain_text;
                const annotations = part.annotations;
                if (annotations?.code) node = <code>{node}</code>;
                if (annotations?.bold) node = <strong>{node}</strong>;
                if (annotations?.italic) node = <em>{node}</em>;
                if (annotations?.strikethrough) node = <s>{node}</s>;
                if (annotations?.underline) node = <u>{node}</u>;
                const href = safeUrl(
                    part.href ||
                        (part.type === 'text'
                            ? part.text.link?.url
                            : undefined),
                    true
                );
                return (
                    <Fragment key={index}>
                        {href ? (
                            <a href={href} rel="noopener noreferrer">
                                {node}
                            </a>
                        ) : (
                            node
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}

function Block({ block }: { block: BlockObjectResponse }) {
    const content = contentOf(block);
    const text = <RichText text={content.rich_text} />;
    const children = content.children?.length ? (
        <Blocks blocks={content.children} />
    ) : null;
    switch (block.type) {
        case 'paragraph':
            return (
                <>
                    <p>{text}</p>
                    {children}
                </>
            );
        case 'heading_1':
        case 'heading_2':
            return (
                <>
                    <h2>{text}</h2>
                    {children}
                </>
            );
        case 'heading_3':
            return (
                <>
                    <h3>{text}</h3>
                    {children}
                </>
            );
        case 'quote':
            return (
                <blockquote>
                    {text}
                    {children}
                </blockquote>
            );
        case 'callout':
            return (
                <aside>
                    {text}
                    {children}
                </aside>
            );
        case 'toggle':
            return (
                <details>
                    <summary>{text}</summary>
                    {children}
                </details>
            );
        case 'to_do':
            return (
                <div>
                    <span
                        aria-label={content.checked ? 'Complete' : 'Incomplete'}
                    >
                        {content.checked ? '☑' : '☐'}
                    </span>{' '}
                    {text}
                    {children}
                </div>
            );
        case 'divider':
            return <hr />;
        case 'code':
            return (
                <BlockCode
                    text={(content.rich_text || [])
                        .map((part) => part.plain_text)
                        .join('')}
                    language={content.language || 'Code'}
                />
            );
        case 'image': {
            const src = safeUrl(content.external?.url || content.file?.url);
            if (!src) return null;
            const caption = (content.caption || [])
                .map((part) => part.plain_text)
                .join('');
            return (
                <figure>
                    <Image
                        src={src}
                        alt={caption}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    />
                    {caption && (
                        <figcaption>
                            <RichText text={content.caption} />
                        </figcaption>
                    )}
                </figure>
            );
        }
        case 'table': {
            const rows = content.children || [];
            const renderRow = (row: BlockObjectResponse, header: boolean) => (
                <tr key={row.id}>
                    {(contentOf(row).cells || []).map((cell, i) =>
                        header || (content.has_row_header && i === 0) ? (
                            <th key={i} scope={header ? 'col' : 'row'}>
                                <RichText text={cell} />
                            </th>
                        ) : (
                            <td key={i}>
                                <RichText text={cell} />
                            </td>
                        )
                    )}
                </tr>
            );
            return (
                <div
                    className="article-table"
                    role="region"
                    aria-label="Article table"
                    tabIndex={0}
                >
                    <table>
                        {content.has_column_header && rows[0] && (
                            <thead>{renderRow(rows[0], true)}</thead>
                        )}
                        <tbody>
                            {rows
                                .slice(content.has_column_header ? 1 : 0)
                                .map((row) => renderRow(row, false))}
                        </tbody>
                    </table>
                </div>
            );
        }
        case 'bookmark':
        case 'link_preview':
        case 'embed':
        case 'pdf':
        case 'video':
        case 'audio':
        case 'file': {
            const href = safeUrl(
                content.url || content.external?.url || content.file?.url
            );
            const caption = (content.caption || [])
                .map((part) => part.plain_text)
                .join('');
            return href ? (
                <p>
                    <a href={href} rel="noopener noreferrer">
                        {caption ||
                            `Open ${block.type}: ${new URL(href).hostname}`}
                    </a>
                </p>
            ) : null;
        }
        default:
            return (
                <>
                    {content.rich_text && <p>{text}</p>}
                    {children}
                </>
            );
    }
}

function Blocks({ blocks }: { blocks: BlockObjectResponse[] }) {
    const output: ReactNode[] = [];
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]!;
        if (
            block.type === 'bulleted_list_item' ||
            block.type === 'numbered_list_item'
        ) {
            const items: ReactNode[] = [];
            const type = block.type;
            do {
                const item = blocks[i]!;
                const content = contentOf(item);
                items.push(
                    <li key={item.id}>
                        <RichText text={content.rich_text} />
                        {content.children && (
                            <Blocks blocks={content.children} />
                        )}
                    </li>
                );
                i++;
            } while (blocks[i]?.type === type);
            i--;
            const List = type === 'bulleted_list_item' ? 'ul' : 'ol';
            output.push(<List key={block.id}>{items}</List>);
        } else output.push(<Block key={block.id} block={block} />);
    }
    return <>{output}</>;
}

export default function RenderBlocks({
    blocks,
}: {
    blocks: BlockObjectResponse[];
}) {
    return (
        <div className="rnr-container">
            <Blocks blocks={blocks} />
        </div>
    );
}
