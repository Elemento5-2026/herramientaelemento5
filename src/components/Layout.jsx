import "./Layout.css";

export default function Layout({
  header,
  sidebar,
  children,
}) {
  return (
    <div className="layout">

      <aside className="layout-sidebar">
        {sidebar}
      </aside>

      <div className="layout-main">

        <header className="layout-header">
          {header}
        </header>

        <main className="layout-content">
          {children}
        </main>

      </div>

    </div>
  );
}
