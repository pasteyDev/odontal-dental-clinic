type HeadOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
};

export function buildHead({ title, description = '', path = '/', image }: HeadOptions) {
  const site = (import.meta.env.VITE_PUBLIC_SITE_URL as string) || '';
  const href = site ? new URL(path, site).toString() : path;

  const meta = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: href },
  ] as Array<Record<string, string>>;

  if (image) {
    meta.push({ property: 'og:image', content: image });
    meta.push({ name: 'twitter:image', content: image });
  }

  const links = [{ rel: 'canonical', href }];

  return { meta, links };
}

export default buildHead;
