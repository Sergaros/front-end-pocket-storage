import { Footer } from 'antd/es/layout/layout';

export default function FooterSection() {
  return (
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
      <p className="vt323-regular">
        Pocket Storage ©{new Date().getFullYear()}
      </p>
    </Footer>
  );
}
