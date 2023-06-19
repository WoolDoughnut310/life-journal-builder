import { env } from '$env/dynamic/private';

export function retrieveImage(name?: string) {
	if (!name) return '';
	return `https://link.storjshare.io/raw/${env.STORJ_ACCESS_GRANT}/${env.STORJ_BUCKET_NAME}/${name}.png`;
}
