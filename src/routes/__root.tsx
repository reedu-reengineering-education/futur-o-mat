import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Link to="/" className="[&.active]:font-bold"></Link>
      <Link to="/avatar" className="[&.active]:font-bold"></Link>
      <Link to="/quiz-informations" className="[&.active]:font-bold"></Link>
      <Link to="/quiz-questions" className="[&.active]:font-bold"></Link>
      <Link to="/quiz-result" className="[&.active]:font-bold"></Link>
      <Link to="/wimmelbild" className="[&.active]:font-bold"></Link>
      <Link to="/commitment-call" className="[&.active]:font-bold"></Link>
      <Link to="/share?state=" className="[&.active]:font-bold"></Link>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
