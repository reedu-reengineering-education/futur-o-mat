import AvatarGenerator from '@/components/avatar/AvatarGenerator'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
return  <AvatarGenerator> 

  </AvatarGenerator>
}
