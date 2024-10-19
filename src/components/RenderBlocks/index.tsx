import '@9gustin/react-notion-render/dist/index.css';

import { Render } from '@9gustin/react-notion-render';
import BlockImage from './BlockImage';
import BlockCode from './BlockCode';
import BlockQuote from './BlockQuote';

function RenderBlocks({ ...rest }: React.ComponentProps<typeof Render>) {
    return (
        <Render
            useStyles
            emptyBlocks
            blockComponentsMapper={{
                image: BlockImage,
                code: BlockCode,
                quote: BlockQuote,
            }}
            {...rest}
        />
    );
}

export default RenderBlocks;
