const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>Made with ❤️ using React + Express</p>
      <p className="footer-note">© {year} — Tasks are stored in the backend database</p>
    </footer>
  );
};

export default Footer;
