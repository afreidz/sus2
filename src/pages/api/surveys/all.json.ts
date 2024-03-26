import orm from "./schema";
import type { APIRoute } from "astro";
import type { ORM } from "@/helpers/orm";
import { dataURItoBuffer } from "@/helpers/image";

export type surveys = {
  GET: ORM.SurveyGetPayload<{ include: { questions: true } }>[];
  POST: ORM.SurveyGetPayload<{}>;
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  data.questions.forEach(
    (q: { media: string | Buffer | null }) =>
      (q.media = dataURItoBuffer(q.media as string))
  );

  const survey = await orm.survey.create({
    data: {
      label: data.label,
      createdBy: data.createdBy,
      scoreTypeId: data.scoreTypeId,
      questions: {
        create: data.questions,
      },
      revisions: {
        connect: {
          id: data.revisionId,
        },
      },
    },
  });

  return new Response(JSON.stringify(survey), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const GET: APIRoute = async () => {
  const surveys = await orm.survey.findMany({
    include: { questions: true },
  });

  return new Response(JSON.stringify(surveys), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
