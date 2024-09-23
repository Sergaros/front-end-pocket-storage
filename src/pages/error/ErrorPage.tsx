import { Content } from 'antd/es/layout/layout';
import { Flex } from 'antd';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <Content>
      <Flex style={{ height: '100%' }} justify="center" align="center" vertical>
        <Flex
          justify="flex-end"
          align="center"
          style={{ width: '100%' }}
          vertical
        >
          <h1>Oops, something went wrong...</h1>
          <Link to="/">Go to main page.</Link>
        </Flex>
      </Flex>
    </Content>
  );
}
