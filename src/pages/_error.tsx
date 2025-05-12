import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';

function Error(props: { statusCode: number }) {
    return <NextErrorComponent statusCode={props.statusCode} />;
}

Error.getInitialProps = async (ctx: NextPageContext) => {
    return NextErrorComponent.getInitialProps(ctx);
};

export default Error;
