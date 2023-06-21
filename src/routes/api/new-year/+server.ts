import type { RequestHandler } from './$types';
import svg2img from 'svg2img';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getYear from 'date-fns/getYear/index.js';
import {
	S3_ENDPOINT,
	STORJ_BUCKET_NAME,
	MY_AWS_ACCESS_KEY_ID,
	MY_AWS_SECRET_ACCESS_KEY
} from '$env/static/private';

const client = new S3Client({
	endpoint: S3_ENDPOINT,
	region: 'eu-west-1',
	credentials: {
		accessKeyId: MY_AWS_ACCESS_KEY_ID,
		secretAccessKey: MY_AWS_SECRET_ACCESS_KEY
	}
});

const sourceSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   width="1500"
   height="600"
   viewBox="0 0 396.87499 158.75"
   version="1.1"
   id="svg1752">
  <defs
     id="defs1746" />
  <metadata
     id="metadata1749">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     id="layer1">
    <text
       xml:space="preserve"
       style="font-size:50.8px;line-height:1.25;font-family:'Fredoka One';-inkscape-font-specification:'Fredoka One, Normal';stroke-width:0.264583"
       x="136.61394"
       y="97.917"
       id="text2331"><tspan
         id="tspan2329"
         x="136.61394"
         y="97.917"
         style="stroke-width:0.264583">20<tspan
   style="fill:#0f7b6c;fill-opacity:1"
   id="tspan2333">23</tspan></tspan></text>
  </g>
</svg>`;

export const POST = (async () => {
	const year = (getYear(new Date()) + 1).toString();

	const filename = `${year}.png`;
	const firstPart = year.slice(0, 2);
	const lastPart = year.slice(2);

	const contents = sourceSVG
		.replace(`style="stroke-width:0.264583">20`, `style="stroke-width:0.264583">${firstPart}`)
		.replace(`id="tspan2333">23`, `id="tspan2333">${lastPart}`);

	// convert SVG to local PNG file
	const buffer = await new Promise<Blob>((resolve, reject) => {
		svg2img(
			contents,
			{
				resvg: {
					background: 'rgb(255, 255, 255)'
				}
			},
			async (err, buffer) => {
				if (err) return reject(err);
				resolve(buffer);
			}
		);
	});

	// upload to Storj (AWS)
	await client.send(
		new PutObjectCommand({
			Bucket: STORJ_BUCKET_NAME,
			Key: filename,
			Body: buffer
		})
	);

	return new Response();
}) satisfies RequestHandler;
