export async function uploadImage(
  bytes: Uint8Array,
  filename: string,
  metadata: Record<string, string>,
): Promise<{ id: string }> {
  const accountId = Deno.env.get("CF_ACCOUNT_ID");
  const token = Deno.env.get("CF_IMAGES_TOKEN");
  if (!accountId || !token) throw new Error("images: CF_ACCOUNT_ID or CF_IMAGES_TOKEN not set");

  const form = new FormData();
  form.append("file", new Blob([bytes as BlobPart]), filename);
  form.append("requireSignedURLs", "true");
  form.append("metadata", JSON.stringify(metadata));

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    },
  );
  if (!res.ok) throw new Error(`images: upload failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return { id: body.result.id };
}
