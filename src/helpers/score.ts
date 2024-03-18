// Algorithm:
// answers range from 1 - 5
// for "positive" question ids subtract one from the user response
// for "negative" question ids subtract the user response from 5
// sum and multiply the final score by 2.5 to get a score out of 100
// average all the responses to get a final raw score

import type { APIResponses } from "@/helpers/api";

type SurveyRespondents =
  APIResponses["systemId"]["GET"]["revisions"][number]["respondents"];

export function calculateAverageScoreForRevision(
  respondents: SurveyRespondents
) {
  const scores = calculateScoreFromRespondents(respondents);
  return scores.reduce((a, b) => a + b, 0) / scores.length || 0;
}

export function calculateScoreFromRespondents(respondents: SurveyRespondents) {
  const scores = respondents.map(calculateScoreFromRespondent);
  return scores;
}

export function calculateScoreFromRespondent(
  respondent: SurveyRespondents[number]
) {
  const score = respondent.responses.reduce((score, response) => {
    if (!response.curratedResponse?.susValue) return score;
    return (score += response.question.positive
      ? response.curratedResponse.susValue - 1
      : 5 - response.curratedResponse.susValue);
  }, 0);

  return score * 2.5;
}