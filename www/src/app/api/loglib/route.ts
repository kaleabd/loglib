//generated by loglib
import { createServerRoutes } from "@loglib/next"

import { db } from "@/lib/db"
import { prismaAdapter } from "@/lib/db/custom-adapter"
import { getCurrentUser } from "@/lib/session"
import { siteConfig } from "@/config/site"

export const { GET, POST, OPTIONS } = createServerRoutes({
  adapter: prismaAdapter(db),
  disableLocation: process.env.NODE_ENV === "development" ? true : false,
  environment: process.env.NODE_ENV === "development" ? "test" : "production",
  middleware: async (req, options, next) => {
    const { websiteId } = req.method === "GET" ? req.query : req.body
    if (!websiteId) {
      return {
        message: "WebsiteId not specified",
        code: 400,
      }
    }
    const id = websiteId as string
    if (req.method === "GET") {
      const user = await getCurrentUser()
      if (!user) return { message: "Unauthorized", code: 401 }
      const website = await db.website.findFirst({
        where: {
          AND: {
            id,
            userId: user.id,
          },
        },
      })
      if (!website) {
        const teamWebsite = await db.teamWebsite.findFirst({
          where: {
            AND: {
              websiteId: id,
              Team: {
                TeamUser: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        })
        if (!teamWebsite) {
          return {
            message: "Website not found",
            code: 404,
          }
        }
      }
    }
    if (req.method === "POST") {
      const site = await db.website.findFirst({
        where: {
          AND: {
            id,
            url: {
              in:
                process.env.NODE_ENV === "development"
                  ? siteConfig.url
                  : (req.headers.origin as string),
            },
          },
        },
      })
      if (!site) {
        return {
          message: "Website not found",
          code: 404,
        }
      }
    }
    return await next(req, options)
  },
})
