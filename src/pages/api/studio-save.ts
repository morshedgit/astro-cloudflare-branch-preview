import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { branch, commitMsg, content } = body;

    const repoOwner = "morshedgit";
    const repoName = "astro-cloudflare-branch-preview";
    const githubToken = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "GITHUB_TOKEN is missing in environment secrets. Add GITHUB_TOKEN to Cloudflare environment variables to execute server-side API commits."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanBranch = branch.startsWith('studio/') ? branch : `studio/${branch}`;
    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Astro-Studio-Server-Endpoint',
      'Content-Type': 'application/json'
    };

    // 1. Get latest commit SHA from 'main'
    const mainRefRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`, { headers });
    if (!mainRefRes.ok) {
      throw new Error(`Failed to fetch main ref: ${mainRefRes.statusText}`);
    }
    const mainRefData = await mainRefRes.json();
    const mainSha = mainRefData.object.sha;

    // 2. Create new branch ref
    const createBranchRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${cleanBranch}`,
        sha: mainSha
      })
    });

    // If branch already exists (422), we can still commit to it
    if (!createBranchRes.ok && createBranchRes.status !== 422) {
      throw new Error(`Failed to create branch ${cleanBranch}: ${createBranchRes.statusText}`);
    }

    // 3. Get existing file SHA on main
    const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/pages/index.astro?ref=main`, { headers });
    let fileSha = undefined;
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      fileSha = fileData.sha;
    }

    // 4. Commit updated file to new branch
    const encodedContent = Buffer.from(content || '').toString('base64');
    const updateRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/pages/index.astro`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: commitMsg || `feat(studio): update page design and content on ${cleanBranch}`,
        content: encodedContent,
        branch: cleanBranch,
        sha: fileSha
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Failed to commit file to GitHub: ${errText}`);
    }

    const previewUrlName = cleanBranch.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    const previewUrl = `https://${previewUrlName}.${repoName}.pages.dev`;

    return new Response(
      JSON.stringify({
        success: true,
        branch: cleanBranch,
        previewUrl,
        message: `Branch '${cleanBranch}' created & committed successfully via secure server API!`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred in studio-save API"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
