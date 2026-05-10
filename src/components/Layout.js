import Sidebar from './Sidebar';

function Layout(props) {
  return (
    <main>
      <Sidebar page={props.page} />
      <div
        className={{
          content: props.className,
        }}
      >
        {props.children}
      </div>
    </main>
  );
}

export default Layout;
