import { defineSchemaConfig } from "#content/config";
import { z } from "zod";

export default defineSchemaConfig({
  cv: z.object({
    _schema: z.literal("cv"),
    title: z.string(),
    summary: z.string(),
    quick_info: z.object({
      location: z.string(),
      experience: z.string(),
      languages: z.array(z.string()),
      contact: z.object({
        email: z.string(),
        linkedin: z.string(),
        github: z.string(),
      }),
    }),
    technical_expertise: z.object({
      frontend_development: z.object({
        title: z.string(),
        skills: z.array(z.string()),
      }),
      backend_infrastructure: z.object({
        title: z.string(),
        skills: z.array(z.string()),
      }),
    }),
    certifications: z.array(
      z.object({
        title: z.string(),
        issuer: z.string(),
        date: z.string(),
        description: z.string(),
        registration_id: z.string().optional(),
      })
    ),
    professional_experience: z.array(
      z.object({
        company: z.string(),
        location: z.string().optional(),
        position: z.string(),
        period: z.string(),
        responsibilities: z.array(z.string()),
      })
    ),
    major_projects: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        period: z.string(),
        stats: z
          .object({
            cities: z.number(),
            countries: z.number(),
            active_members: z.number(),
            events_organized: z.number(),
          })
          .optional(),
        achievements: z.array(z.string()),
      })
    ),
    leadership_process: z.object({
      process_improvement: z.array(z.string()),
      team_leadership: z.array(z.string()),
    }),
    volunteering: z.array(
      z.object({
        organization: z.string(),
        role: z.string(),
        field: z.string(),
        period: z.string().optional(),
        achievements: z.array(z.string()).optional(),
        responsibilities: z.array(z.string()).optional(),
      })
    ),
    speaking_community: z.object({
      conference_talks: z.array(
        z.object({
          title: z.string(),
          event: z.string(),
        })
      ),
      community_involvement: z.array(z.string()),
    }),
    education: z.array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        period: z.string(),
        achievements: z.array(z.string()),
      })
    ),
  }),
});
