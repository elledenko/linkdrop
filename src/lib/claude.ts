import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function summarizeContent(
  title: string,
  content: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Summarize this article in 2-3 concise sentences. Focus on the key insight or takeaway — what makes this worth reading. Be direct and informative, not fluffy.

Title: ${title}

Content:
${content.slice(0, 15000)}`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function generateDigest(
  links: Array<{
    title: string | null;
    url: string;
    ai_summary: string | null;
    user_note: string | null;
    site_name: string | null;
  }>,
  uploads: Array<{
    file_name: string;
    user_note: string | null;
  }>,
  voiceProfile: {
    bio: string | null;
    voice_description: string | null;
    writing_samples: string[];
  },
  date: string
): Promise<{
  title: string;
  content: string;
  export_linkedin: string;
  export_x: string;
  export_medium: string;
  export_substack: string;
}> {
  const linksBlock = links
    .map(
      (l, i) =>
        `${i + 1}. "${l.title || "Untitled"}" (${l.site_name || l.url})
   Summary: ${l.ai_summary || "No summary"}
   User's take: ${l.user_note || "None"}
   URL: ${l.url}`
    )
    .join("\n\n");

  const uploadsBlock =
    uploads.length > 0
      ? uploads
          .map(
            (u) =>
              `- File: ${u.file_name}${u.user_note ? `\n  Note: ${u.user_note}` : ""}`
          )
          .join("\n")
      : "None";

  const samplesBlock =
    voiceProfile.writing_samples.length > 0
      ? voiceProfile.writing_samples
          .map((s, i) => `Sample ${i + 1}:\n${s}`)
          .join("\n\n---\n\n")
      : "No samples provided";

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are writing a daily link digest / newsletter post for someone. Your job is to write it in THEIR voice, based on their profile and writing samples.

## Author Profile
Bio: ${voiceProfile.bio || "Not provided"}
Writing style: ${voiceProfile.voice_description || "Not provided"}

## Writing Samples (match this voice)
${samplesBlock}

## Today's Links (${date})
${linksBlock}

## Today's Uploads
${uploadsBlock}

## Instructions
Write a newsletter-style daily digest post covering all the links and uploads from today. Requirements:
1. Write in the author's voice — match their tone, vocabulary, sentence structure
2. Group related links by theme if natural (use section headers with emoji)
3. For each link, provide your own commentary (not just the summary) — be opinionated
4. Reference uploads naturally if they have notes
5. Include a brief intro and sign-off
6. Each link mention should include "→ Read more" with the URL
7. Keep it engaging and scannable — short paragraphs, bold key points

Return your response as JSON with this exact structure:
{
  "title": "A catchy title for today's digest",
  "content": "The full digest in markdown format"
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  const block = message.content[0];
  const text = block.type === "text" ? block.text : "{}";

  let parsed: { title: string; content: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = { title: `Daily Digest — ${date}`, content: text };
    }
  }

  // Generate platform-specific exports
  const exports = await generateExports(parsed.content, parsed.title, links);

  return {
    ...parsed,
    ...exports,
  };
}

async function generateExports(
  content: string,
  title: string,
  links: Array<{ title: string | null; url: string }>
): Promise<{
  export_linkedin: string;
  export_x: string;
  export_medium: string;
  export_substack: string;
}> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Take this newsletter digest and reformat it for different platforms. Keep the same voice and content but adapt the format.

Title: ${title}
Content:
${content}

Return JSON with these four keys:
{
  "export_linkedin": "LinkedIn post format — professional but personal, use line breaks for readability, include relevant hashtags at the end, keep under 3000 characters",
  "export_x": "X/Twitter thread format — break into numbered tweets (1/N format), each under 280 characters, include URLs naturally",
  "export_medium": "Medium article format — full markdown with proper headers, pull quotes, and formatting",
  "export_substack": "Substack newsletter format — conversational, includes section headers, designed for email reading"
}

Return ONLY the JSON.`,
      },
    ],
  });

  const block = message.content[0];
  const text = block.type === "text" ? block.text : "{}";

  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      export_linkedin: content,
      export_x: content,
      export_medium: content,
      export_substack: content,
    };
  }
}
