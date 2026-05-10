function Footer() {
  return (
    <footer
      style={{
        background: '#1a1410',
        color: '#f5efe0',
        padding: '22px 24px',
        textAlign: 'center',
        fontFamily: "'Bangers', 'Oswald', system-ui, sans-serif",
        fontSize: '1rem',
        letterSpacing: '0.12em',
        borderTop: '3px solid #1a1410',
        position: 'relative',
        zIndex: 2,
      }}
    >
      © EDUARDO BONILLA SANTOS {new Date().getFullYear()} · SAN JUAN, PR
    </footer>
  );
}

export default Footer;
