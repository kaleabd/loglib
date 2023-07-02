import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { WebsiteCreateButton } from "@/components/website-create-button"
import { WebsiteForm } from "@/components/website-create-form"
import { WebsitesList } from "@/components/websites-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/login")
  const websites = await db.website.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      WebSession: {
        distinct: ["visitorId"],
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id: true,
        },
      },
    },
  })
  return (
    <section>
      <div className=" flex justify-end">
        <WebsiteCreateButton />
      </div>
      <WebsitesList />
      <WebsiteForm />
    </section>
  )
}
