import AvatarGenerator from '@/AvatarGenerator'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AvatarGenerator> 
    
  </AvatarGenerator>
}
