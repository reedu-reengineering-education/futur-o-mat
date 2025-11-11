import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/commitmentCall')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/commitmentCall"!</div>
}
